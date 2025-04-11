import React, { useState } from 'react';
import { ShareIcon, UserGroupIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

interface TripSharingProps {
  tripId: string;
  isPublic: boolean;
  sharedWith: Array<{
    email: string;
    accessLevel: 'view' | 'edit';
    sharedAt: string;
  }>;
  onShareUpdate: () => void;
}

export default function TripSharing({ tripId, isPublic, sharedWith, onShareUpdate }: TripSharingProps) {
  const [emails, setEmails] = useState('');
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('view');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleShare = async () => {
    if (!emails.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    const emailList = emails.split(',').map(email => email.trim());
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/trips/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId,
          shareWithEmails: emailList,
          accessLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share trip');
      }

      const data = await response.json();
      setEmails('');
      onShareUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share trip');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakePublic = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_public: !isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip visibility');
      }

      const data = await response.json();
      setShareLink(data.shareLink);
      onShareUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update trip visibility');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Share Trip</h3>
        <button
          onClick={handleMakePublic}
          className={`flex items-center px-4 py-2 rounded-md ${
            isPublic
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={isLoading}
        >
          {isPublic ? (
            <>
              <LockOpenIcon className="h-5 w-5 mr-2" />
              Public
            </>
          ) : (
            <>
              <LockClosedIcon className="h-5 w-5 mr-2" />
              Private
            </>
          )}
        </button>
      </div>

      {shareLink && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Public Share Link
          </label>
          <div className="flex">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shareLink)}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Share with specific users
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="Enter email addresses (comma-separated)"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value as 'view' | 'edit')}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
          <button
            onClick={handleShare}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Share
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {sharedWith.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Shared with
          </h4>
          <ul className="divide-y divide-gray-200">
            {sharedWith.map((share) => (
              <li key={share.email} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{share.email}</span>
                </div>
                <span className="text-xs text-gray-500 capitalize">
                  {share.accessLevel} access
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 