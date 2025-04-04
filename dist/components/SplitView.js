"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SplitView;
const react_1 = __importDefault(require("react"));
function SplitView({ mapSection, contentSection, mapWidth = "70%" }) {
    return (react_1.default.createElement("div", { className: "flex flex-1 h-full overflow-hidden" },
        react_1.default.createElement("div", { className: "relative h-full overflow-hidden", style: { width: mapWidth } }, mapSection),
        react_1.default.createElement("div", { className: "h-full overflow-auto", style: { width: `calc(100% - ${mapWidth})` } },
            react_1.default.createElement("div", { className: "p-4" }, contentSection))));
}
//# sourceMappingURL=SplitView.js.map