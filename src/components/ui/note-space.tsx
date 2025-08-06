// For backward compatibility with existing implementations
// This wrapper uses the EnhancedNoteSpace component
import { EnhancedNoteSpace } from './enhanced-note-space';

interface SidebarItem {
  id: string;
  title: string;
  content?: string;
  onClick?: () => void;
}

interface NoteSpaceProps {
  leftSidebarTitle?: string;
  leftSidebarItems?: SidebarItem[];
  rightSidebarTitle?: string;
  rightSidebarItems?: SidebarItem[];
  initialContent?: string;
  onContentSave?: (content: string) => void;
  className?: string;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  onClose?: () => void;
}

export function NoteSpace({
  leftSidebarTitle = "Left Panel",
  leftSidebarItems = [],
  rightSidebarTitle = "Right Panel", 
  rightSidebarItems = [],
  initialContent = "",
  onContentSave,
  className = "",
  showLeftSidebar = true,
  showRightSidebar = true,
  onClose
}: NoteSpaceProps) {
  // Create a mock entity for compatibility with EnhancedNoteSpace
  const mockEntity = {
    name: "Note Space",
    notes: initialContent,
  };

  const handleSave = (updatedEntity: any) => {
    if (onContentSave && updatedEntity.notes !== undefined) {
      onContentSave(updatedEntity.notes);
    }
  };

  // Convert sidebar items to content format
  const leftSidebarContent = leftSidebarItems.length > 0 ? (
    <div className="space-y-2">
      {leftSidebarItems.map((item) => (
        <div key={item.id} className="bg-muted/50 p-2 rounded border">
          <h5 className="text-xs font-medium mb-1">{item.title}</h5>
          <button 
            onClick={item.onClick}
            className="w-full text-left text-xs text-muted-foreground hover:text-foreground"
          >
            Click to view
          </button>
        </div>
      ))}
    </div>
  ) : undefined;

  const rightSidebarContent = rightSidebarItems.length > 0 ? (
    <div className="space-y-2">
      {rightSidebarItems.map((item) => (
        <div key={item.id} className="bg-muted/50 p-2 rounded border">
          <h5 className="text-xs font-medium mb-1">{item.title}</h5>
          <button 
            onClick={item.onClick}
            className="w-full text-left text-xs text-muted-foreground hover:text-foreground"
          >
            Click to view
          </button>
        </div>
      ))}
    </div>
  ) : undefined;

  return (
    <div className={className}>
      <EnhancedNoteSpace
        entity={mockEntity}
        entityType="asset"
        onSave={handleSave}
        onClose={onClose || (() => {})}
        leftSidebarTitle={leftSidebarTitle}
        rightSidebarTitle={rightSidebarTitle}
        showLeftSidebar={showLeftSidebar}
        showRightSidebar={showRightSidebar}
        leftSidebarContent={leftSidebarContent}
        rightSidebarContent={rightSidebarContent}
      />
    </div>
  );
}

export default NoteSpace;
