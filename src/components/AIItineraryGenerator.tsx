import React, { useState } from 'react';
import { FormTrip } from "@/types";
import { cities } from "@/lib/cities";
import {
  SparklesIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CheckIcon,
  DocumentTextIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { generateTextItinerary } from '@/lib/api/deepseekService';

interface AIItineraryGeneratorProps {
  trip: FormTrip;
  attractions: Record<string, any[]>;
  getWeatherForStop: (stop: any) => any;
  budgetLevel: string;
}

export default function AIItineraryGenerator({ 
  trip,
  attractions,
  getWeatherForStop,
  budgetLevel
}: AIItineraryGeneratorProps) {
  // State for AI itinerary
  const [itineraryMarkdown, setItineraryMarkdown] = useState<string>('');
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const [itineraryError, setItineraryError] = useState<string | null>(null);
  const [itineraryGenerated, setItineraryGenerated] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showCitySelection, setShowCitySelection] = useState(false);
  
  // Get the cities from the trip
  const tripCities = trip.stops.map(stop => {
    const city = cities.find(c => c.id === stop.cityId);
    return {
      id: stop.cityId,
      name: city?.name || 'Unknown',
      country: city?.country || '',
      isStopover: stop.isStopover,
      selected: true, // Default to selected
    };
  });
  
  // State for city selection
  const [selectedCities, setSelectedCities] = useState(tripCities);
  
  // State for specific recommendations
  const [specificRecommendations, setSpecificRecommendations] = useState({
    food: false,
    culturalActivities: false,
    nightlife: false,
    shopping: false,
    outdoorActivities: false,
    familyFriendly: false,
    budgetConsciousTips: false,
    historicalSites: false,
    localExperiences: false
  });

  // Handle checkbox changes for recommendations
  const handleRecommendationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSpecificRecommendations(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle city selection changes
  const handleCitySelectionChange = (cityId: string, checked: boolean) => {
    setSelectedCities(prev => 
      prev.map(city => 
        city.id === cityId ? { ...city, selected: checked } : city
      )
    );
  };
  
  // Select/deselect all cities
  const toggleAllCities = (select: boolean) => {
    setSelectedCities(prev => 
      prev.map(city => ({ ...city, selected: select }))
    );
  };

  // Generate the AI itinerary
  const generateAIItinerary = async () => {
    try {
      setIsGeneratingItinerary(true);
      setItineraryError(null);
      
      // Filter stops based on selected cities
      const filteredStops = trip.stops.filter(stop => 
        selectedCities.find(city => city.id === stop.cityId && city.selected)
      );
      
      if (filteredStops.length === 0) {
        setItineraryError('Please select at least one city for your itinerary.');
        setIsGeneratingItinerary(false);
        return;
      }
      
      // Calculate total days in the itinerary
      let totalDays = 0;
      for (let i = 0; i < filteredStops.length; i++) {
        const currentStop = filteredStops[i];
        const nextStop = filteredStops[i + 1];
        
        // Calculate the days at this stop
        if (nextStop) {
          const currentDate = new Date(currentStop.arrivalDate);
          const nextDate = new Date(nextStop.arrivalDate);
          const diffTime = Math.abs(nextDate.getTime() - currentDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          totalDays += diffDays;
        } else if (i === filteredStops.length - 1) {
          // For the last stop, use the nights property
          totalDays += currentStop.nights || 1;
        }
      }
      
      // Check if total days exceeds the limit
      if (totalDays > 7) {
        setItineraryError('Your itinerary exceeds the maximum of 7 days. Please select fewer cities or reduce the duration of your stays.');
        setIsGeneratingItinerary(false);
        return;
      }
      
      // Create a filtered trip object
      const filteredTrip = {
        ...trip,
        stops: filteredStops
      };
      
      // Collect attractions for each selected city
      const tripAttractions: Record<string, any[]> = {};
      filteredStops.forEach(stop => {
        const city = cities.find(c => c.id === stop.cityId);
        if (city) {
          const cityName = city.name;
          tripAttractions[cityName] = attractions[cityName] || [];
        }
      });
      
      // Collect weather info for each selected city
      const tripWeather: Record<string, any> = {};
      filteredStops.forEach(stop => {
        const city = cities.find(c => c.id === stop.cityId);
        if (city) {
          const cityName = city.name;
          tripWeather[cityName] = getWeatherForStop(stop);
        }
      });
      
      // Determine if any specific recommendations are selected
      const hasSpecificRecommendations = Object.values(specificRecommendations).some(value => value);
      
      // Call the API to generate the itinerary using our service
      const itinerary = await generateTextItinerary({
        trip: filteredTrip,
        attractions: tripAttractions,
        weather: tripWeather,
        budgetLevel,
        additionalNotes: additionalNotes.trim() || undefined,
        specificRecommendations: hasSpecificRecommendations ? specificRecommendations : undefined
      });
      
      setItineraryMarkdown(itinerary);
      setItineraryGenerated(true);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setItineraryError('Failed to generate the itinerary. Please try again later.');
    } finally {
      setIsGeneratingItinerary(false);
    }
  };
  
  // Toggle city selection panel
  const toggleCitySelection = () => {
    setShowCitySelection(!showCitySelection);
  };
  
  // Reset the itinerary
  const resetItinerary = () => {
    setItineraryMarkdown('');
    setItineraryGenerated(false);
    setAdditionalNotes('');
    setSpecificRecommendations({
      food: false,
      culturalActivities: false,
      nightlife: false,
      shopping: false,
      outdoorActivities: false,
      familyFriendly: false,
      budgetConsciousTips: false,
      historicalSites: false,
      localExperiences: false
    });
    setShowAdvancedOptions(false);
    setShowCitySelection(false);
    // Reset selectedCities to all selected
    setSelectedCities(tripCities.map(city => ({ ...city, selected: true })));
  };

  // Toggle advanced options
  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  // Add this helper function near the top of the component to render markdown with styling
  const renderMarkdown = (markdown: string) => {
    // Convert markdown to HTML with enhanced styling
    const html = markdown
      .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold text-teal-700 border-b border-gray-200 pb-2 mb-4">$1</h1>')
      .replace(/## (.*?)$/gm, '<h2 class="text-xl font-semibold text-blue-600 mt-6 mb-3">$1</h2>')
      .replace(/### (.*?)$/gm, '<h3 class="text-lg font-medium text-indigo-600 mt-4 mb-2">$1</h3>')
      .replace(/#### (.*?)$/gm, '<h4 class="text-base font-medium text-gray-700 mt-3 mb-2">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      .replace(/- (.*?)$/gm, '<li class="mb-1 pl-1">$1</li>')
      .replace(/^\s*\d+\.\s+(.*?)$/gm, '<li class="mb-2 pl-1 list-decimal">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-lg shadow-md max-w-full h-auto">')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Wrap the content with proper list containers
    let processedHtml = html
      .replace(/<li class="mb-1 pl-1">/g, '<ul class="list-disc pl-5 mb-4"><li class="mb-1 pl-1">')
      .replace(/<li class="mb-2 pl-1 list-decimal">/g, '<ol class="list-decimal pl-5 mb-4"><li class="mb-2 pl-1 list-decimal">');

    // Close lists
    processedHtml = processedHtml
      .replace(/<\/li>\s*<(?!li)/g, '</li></ul><')
      .replace(/<\/li>\s*<li class="mb-2 pl-1 list-decimal">/g, '</li></ol><ol class="list-decimal pl-5 mb-4"><li class="mb-2 pl-1 list-decimal">')
      .replace(/<\/li>\s*<li class="mb-1 pl-1">/g, '</li></ul><ul class="list-disc pl-5 mb-4"><li class="mb-1 pl-1">');

    // Fix paragraph issues
    processedHtml = `<p class="mb-4">${processedHtml}</p>`;
    
    // Return as dangerously set inner HTML
    return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />;
  };

  // Download the itinerary as PDF
  const downloadItinerary = async () => {
    if (!itineraryMarkdown) return;
    
    try {
      setIsPdfGenerating(true);
      
      // Convert markdown to HTML for PDF generation
      const markdownToHtml = (markdown: string) => {
        // Enhanced markdown to HTML conversion
        const html = markdown
          .replace(/# (.*?)$/gm, '<h1 style="font-size: 24px; font-weight: bold; color: #2A9D8F; border-bottom: 2px solid #2A9D8F; padding-bottom: 10px; margin-top: 25px;">$1</h1>')
          .replace(/## (.*?)$/gm, '<h2 style="font-size: 20px; font-weight: 600; color: #264653; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">$1</h2>')
          .replace(/### (.*?)$/gm, '<h3 style="font-size: 18px; font-weight: 500; color: #E76F51; margin-top: 15px;">$1</h3>')
          .replace(/#### (.*?)$/gm, '<h4 style="font-size: 16px; font-weight: 500; color: #F4A261; margin-top: 10px;">$1</h4>')
          .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #2A9D8F;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #555;">$1</em>')
          .replace(/- (.*?)$/gm, '<li style="margin-bottom: 8px; margin-left: 20px;">$1</li>')
          .replace(/^\s*\d+\.\s+(.*?)$/gm, '<li style="margin-bottom: 8px; margin-left: 20px; list-style-type: decimal;">$1</li>')
          .replace(/\n\n/g, '</p><p style="margin-bottom: 16px;">')
          .replace(/\n/g, '<br/>');
        
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>${trip.name || 'Trip'} Itinerary</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                font-size: 14px;
              }
              h1 {
                color: #2A9D8F;
                border-bottom: 2px solid #2A9D8F;
                padding-bottom: 10px;
                margin-top: 25px;
                font-size: 24px;
              }
              h2 {
                color: #264653;
                margin-top: 20px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
                font-size: 20px;
              }
              h3 {
                color: #E76F51;
                margin-top: 15px;
                font-size: 18px;
              }
              h4 {
                color: #F4A261;
                margin-top: 10px;
                font-size: 16px;
              }
              p {
                margin-bottom: 16px;
              }
              li {
                margin-bottom: 8px;
              }
              ul, ol {
                padding-left: 20px;
                margin-bottom: 16px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #2A9D8F;
                padding-bottom: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 20px;
              }
              @media print {
                body {
                  width: 100%;
                  max-width: none;
                  padding: 15px;
                  font-size: 12pt;
                }
                h1 { font-size: 20pt; }
                h2 { font-size: 16pt; }
                h3 { font-size: 14pt; }
                h4 { font-size: 12pt; }
                p, li { font-size: 11pt; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${trip.name || 'Trip'} Itinerary</h1>
              <p>Generated by GoEuroRail Smart Trip Assistant</p>
            </div>
            <p style="margin-bottom: 16px;">${html}</p>
            <div class="footer">
              <p>Created with GoEuroRail AI Itinerary Generator</p>
              <p>© ${new Date().getFullYear()} GoEuroRail</p>
            </div>
          </body>
          </html>
        `;
      };
      
      // Convert markdown to HTML
      const htmlContent = markdownToHtml(itineraryMarkdown);
      
      // Use a text-based approach rather than canvas for searchable text
      try {
        // Directly generate HTML file with print instructions
        const filename = `${trip.name || 'Trip'}_Itinerary_${new Date().toISOString().slice(0, 10)}.html`;
        
        // Create an enhanced HTML version with print button and instructions
        const printableHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>${trip.name || 'Trip'} Itinerary</title>
            <style>
              @media screen {
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .print-instructions {
                  background-color: #f8f9fa;
                  border-radius: 5px;
                  padding: 15px;
                  margin: 20px 0;
                  text-align: center;
                }
                .print-button {
                  background-color: #2A9D8F;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  padding: 10px 20px;
                  font-weight: bold;
                  cursor: pointer;
                  font-size: 14px;
                }
                .print-instructions-text {
                  margin-bottom: 10px;
                }
              }
              
              @media print {
                .print-instructions {
                  display: none;
                }
              }
            </style>
            <script>
              function printAsPDF() {
                // Set optimal print settings
                const style = document.createElement('style');
                style.textContent = '@page { size: A4; margin: 1cm; }';
                document.head.appendChild(style);
                
                window.print();
                document.head.removeChild(style);
              }
              
              // Automatically open print dialog when page loads
              window.onload = function() {
                // Give the browser a moment to render everything
                setTimeout(function() {
                  const printButton = document.getElementById('print-pdf-button');
                  if (printButton) {
                    printButton.focus();
                  }
                }, 500);
              };
            </script>
          </head>
          <body>
            <div class="print-instructions">
              <p class="print-instructions-text">For best results, click the button below and use these settings in the print dialog:</p>
              <ul style="text-align: left; display: inline-block; margin-bottom: 15px;">
                <li>Destination: "Save as PDF"</li>
                <li>Layout: "Portrait"</li>
                <li>Paper size: "A4" or "Letter"</li>
                <li>Margins: "Default" or "Normal"</li>
                <li>Scale: "100%" (important!)</li>
                <li>Options: Enable "Background graphics"</li>
              </ul>
              <button id="print-pdf-button" onclick="printAsPDF()" class="print-button">
                Print / Save as PDF
              </button>
            </div>
            
            ${htmlContent}
            
            <script>
              // Add page breaks before each major city section for better printing
              document.querySelectorAll('h1, h2').forEach(heading => {
                if (heading.textContent.indexOf('Day') === -1) { // Don't add page breaks before day headings
                  heading.style.pageBreakBefore = 'always';
                }
              });
            </script>
          </body>
          </html>
        `;
        
        const blob = new Blob([printableHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Open in a new tab for better print experience
        window.open(url, '_blank');
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 60000); // Keep the URL valid for a minute to ensure the page loads
        
        setIsPdfGenerating(false);
      } catch (error) {
        console.error('HTML download failed:', error);
        
        // Fallback to simplest possible approach
        const filename = `${trip.name || 'Trip'}_Itinerary_${new Date().toISOString().slice(0, 10)}.html`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('For best results, open the HTML file and use your browser\'s print function to save as PDF. Make sure to set scale to 100% and enable background graphics.');
        
        setIsPdfGenerating(false);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      setIsPdfGenerating(false);
      
      // Ultimate fallback
      alert('We encountered an issue creating your PDF. Please try again later or contact support if the problem persists.');
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-t">
      <p className="text-sm text-gray-700 mb-4">
        Generate a comprehensive trip itinerary with DeepSeek AI, including day-by-day plans, 
        restaurant recommendations, cultural tips, and personalized travel advice.
      </p>
      
      {!itineraryGenerated ? (
        <>
          <div className="mb-4">
            <button
              type="button"
              onClick={toggleCitySelection}
              className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800 mb-2"
            >
              <MapPinIcon className="w-4 h-4 mr-1" />
              {showCitySelection ? 'Hide' : 'Select'} Cities for Itinerary
            </button>
            
            {showCitySelection && (
              <div className="mt-2 p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Select cities to include in your itinerary:</p>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleAllCities(true)}
                      className="text-xs text-teal-600 hover:text-teal-800"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAllCities(false)}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                
                <div className="max-h-48 overflow-y-auto p-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCities.map((city) => (
                      <div key={city.id} className="flex items-center">
                        <input
                          id={`city-${city.id}`}
                          type="checkbox"
                          checked={city.selected}
                          onChange={(e) => handleCitySelectionChange(city.id, e.target.checked)}
                          className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label htmlFor={`city-${city.id}`} className="ml-2 text-sm text-gray-700">
                          {city.name}, {city.country}
                          {city.isStopover && <span className="ml-1 text-xs text-gray-500">(Stopover)</span>}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="additional-notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Preferences (optional)
            </label>
            <textarea
              id="additional-notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any specific preferences, interests, or requirements for your trip? E.g., 'I'm traveling with small children', 'I'm interested in art and history', or 'I prefer vegetarian food'."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <button
              type="button"
              onClick={toggleAdvancedOptions}
              className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1" />
              {showAdvancedOptions ? 'Hide' : 'Show'} Specific Recommendation Options
            </button>
            
            {showAdvancedOptions && (
              <div className="mt-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Select the types of recommendations you want in your itinerary:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <input
                      id="food"
                      name="food"
                      type="checkbox"
                      checked={specificRecommendations.food}
                      onChange={handleRecommendationChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="food" className="ml-2 text-sm text-gray-700">
                      Food & Restaurants
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="culturalActivities"
                      name="culturalActivities"
                      type="checkbox"
                      checked={specificRecommendations.culturalActivities}
                      onChange={handleRecommendationChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="culturalActivities" className="ml-2 text-sm text-gray-700">
                      Cultural Activities
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="nightlife"
                      name="nightlife"
                      type="checkbox"
                      checked={specificRecommendations.nightlife}
                      onChange={handleRecommendationChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="nightlife" className="ml-2 text-sm text-gray-700">
                      Nightlife & Entertainment
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="shopping"
                      name="shopping"
                      type="checkbox"
                      checked={specificRecommendations.shopping}
                      onChange={handleRecommendationChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="shopping" className="ml-2 text-sm text-gray-700">
                      Shopping
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="outdoorActivities"
                      name="outdoorActivities"
                      type="checkbox"
                      checked={specificRecommendations.outdoorActivities}
                      onChange={handleRecommendationChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="outdoorActivities" className="ml-2 text-sm text-gray-700">
                      Outdoor Activities
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="familyFriendly"
                      name="familyFriendly"
                      type="checkbox"
                      checked={specificRecommendations.familyFriendly}
                      onChange={handleRecommendationChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="familyFriendly" className="ml-2 text-sm text-gray-700">
                      Family-Friendly
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="budgetConsciousTips"
                      name="budgetConsciousTips"
                      type="checkbox"
                      checked={specificRecommendations.budgetConsciousTips}
                      onChange={handleRecommendationChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="budgetConsciousTips" className="ml-2 text-sm text-gray-700">
                      Budget-Conscious Tips
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="historicalSites"
                      name="historicalSites"
                      type="checkbox"
                      checked={specificRecommendations.historicalSites}
                      onChange={handleRecommendationChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="historicalSites" className="ml-2 text-sm text-gray-700">
                      Historical Sites
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="localExperiences"
                      name="localExperiences"
                      type="checkbox"
                      checked={specificRecommendations.localExperiences}
                      onChange={handleRecommendationChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="localExperiences" className="ml-2 text-sm text-gray-700">
                      Local Experiences
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={generateAIItinerary}
            disabled={isGeneratingItinerary}
            className={`flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${isGeneratingItinerary ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGeneratingItinerary ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Generating Itinerary...
              </>
            ) : (
              <>
                <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
                Generate AI Itinerary
              </>
            )}
          </button>
          
          {itineraryError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{itineraryError}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Your AI-Generated Itinerary</h3>
            <div className="flex space-x-2">
              <button
                onClick={downloadItinerary}
                disabled={isPdfGenerating}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${isPdfGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                title="Download PDF version of your itinerary"
              >
                {isPdfGenerating ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-1 h-4 w-4" />
                    Creating PDF...
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="-ml-1 mr-1 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </button>
              <button
                onClick={resetItinerary}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                title="Start over and generate a new itinerary"
              >
                <ArrowPathIcon className="-ml-1 mr-1 h-4 w-4" />
                Regenerate
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 overflow-auto max-h-[600px]">
            <div 
              className="prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ 
                __html: itineraryMarkdown
                  .replace(/\n\n/g, '<br/><br/>')
                  .replace(/\n/g, '<br/>')
                  .replace(/# (.*?)$/gm, '<h1 class="text-xl font-bold text-teal-700 mt-4 mb-2">$1</h1>')
                  .replace(/## (.*?)$/gm, '<h2 class="text-lg font-semibold text-teal-600 mt-3 mb-2">$1</h2>')
                  .replace(/### (.*?)$/gm, '<h3 class="text-md font-medium text-teal-500 mt-2 mb-1">$1</h3>')
                  .replace(/#### (.*?)$/gm, '<h4 class="text-sm font-medium text-teal-400 mt-2 mb-1">$1</h4>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/- (.*?)$/gm, '<li class="ml-4">$1</li>')
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 