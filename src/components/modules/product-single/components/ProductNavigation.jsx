import {
  PanelIcon,
  CommentsIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
} from "@/icons";

const sectionButtons = [
  {
    id: "details",
    icon: <PanelIcon size={20} color="currentColor" />,
  },
  {
    id: "specsAndComments",
    icon: <CommentsIcon size={20} color="currentColor" />,
  },
  {
    id: "partnership",
    icon: <ExternalLinkIcon size={20} color="currentColor" />,
  },
];

export default function ProductNavigation({
  activeSection,
  setActiveSection,
  onGoBack,
}) {
  return (
    <>
      {/* Desktop Navigation - Sidebar */}
      <div className="fixed right-[64px] bottom-[64px] z-10 hidden lg:flex flex-col gap-[16px]">
        {sectionButtons.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-[15px] rounded-lg transition-colors ${
              activeSection === section.id
                ? "bg-gray-200 text-primary"
                : "bg-white text-black"
            }`}
          >
            {section.icon}
          </button>
        ))}
        <button
          // onClick={() => setActiveSection("back")}
          className={`p-[15px] rounded-lg transition-colors ${
            activeSection === "back" ? "bg-gray-200 text-primary" : "text-black"
          }`}
        >
          <ArrowRightIcon size={20} color="currentColor" />
        </button>
      </div>

      {/* Mobile Navigation - Bottom Bar */}

      <div className="fixed bottom-[16px] left-[10px] right-[10px] z-10 lg:hidden bg-white rounded-lg p-[10px] flex justify-around items-center">
        <button
          onClick={onGoBack}
          className={`p-[10px] rounded-lg transition-colors ${
            activeSection === "back" ? "text-primary" : "text-black"
          }`}
        >
          <ArrowRightIcon size={20} color="currentColor" />
        </button>
        {sectionButtons.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-[10px] rounded-lg transition-colors ${
              activeSection === section.id ? "text-primary" : "text-black"
            }`}
          >
            {section.icon}
          </button>
        ))}
      </div>
    </>
  );
}
