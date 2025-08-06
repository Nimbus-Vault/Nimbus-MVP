import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import MarkdownRenderer from './markdown-renderer';
import { 
  Save, 
  Edit, 
  Eye, 
  X,
  Settings,
  FileText,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface EnhancedNoteSpaceProps {
  entity: any;
  entityType: 'asset' | 'functionality' | 'technology' | 'behavior';
  onSave: (updatedEntity: any) => void;
  onClose: () => void;
  leftSidebarContent?: React.ReactNode;
  rightSidebarContent?: React.ReactNode;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  leftSidebarTitle?: string;
  rightSidebarTitle?: string;
}

export const EnhancedNoteSpace: React.FC<EnhancedNoteSpaceProps> = ({
  entity,
  entityType,
  onSave,
  onClose,
  leftSidebarContent,
  rightSidebarContent,
  showLeftSidebar = false,
  showRightSidebar = false,
  leftSidebarTitle = "Associated Items",
  rightSidebarTitle = "Suggestions"
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntity, setEditedEntity] = useState(entity);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(showLeftSidebar);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(showRightSidebar);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedEntity(entity);
  }, [entity]);

  const handleSave = () => {
    onSave(editedEntity);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEntity(entity);
    setIsEditing(false);
  };

  const getEntityTitle = () => {
    return editedEntity.name || editedEntity.title || 'Untitled';
  };

  const getMainContent = () => {
    return editedEntity.notes || editedEntity.description || '';
  };

  const updateMainContent = (content: string) => {
    const updatedEntity = { ...editedEntity };
    if ('notes' in editedEntity) {
      updatedEntity.notes = content;
    } else {
      updatedEntity.description = content;
    }
    setEditedEntity(updatedEntity);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="h-14 border-b flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{getEntityTitle()}</h1>
            <p className="text-xs text-muted-foreground">
              {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Independent scroll context */}
        {showLeftSidebar && (
          <>
            {!isLeftSidebarOpen && (
              <div className="flex items-center justify-center border-r bg-muted/10 hover:bg-muted/30 cursor-pointer transition-all" 
                onClick={() => setIsLeftSidebarOpen(true)} 
                style={{ width: '24px' }}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className={`border-r bg-muted/30 transition-all duration-300 ${isLeftSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden flex flex-col`}>
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{leftSidebarTitle}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {leftSidebarContent}
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        {/* Main Content Area - Independent scroll context */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Tabs - Fixed */}
          <div className="border-b flex-shrink-0">
            <div className="flex space-x-4 px-4">
              <div className="py-2 px-1 border-b-2 border-primary text-primary">
                <FileText className="h-4 w-4 inline mr-2" />
                Notes
              </div>
            </div>
          </div>

          {/* Content Editor - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full">
              {isEditing ? (
                <Textarea
                  ref={textareaRef}
                  value={getMainContent()}
                  onChange={(e) => updateMainContent(e.target.value)}
                  placeholder="Enter your notes here (Markdown supported)..."
                  className="h-full resize-none font-mono border-0 focus-visible:ring-0"
                />
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <MarkdownRenderer 
                      content={getMainContent() || 'No content available. Click Edit to add content.'} 
                    />
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Independent scroll context */}
        {showRightSidebar && (
          <>
            {!isRightSidebarOpen && (
              <div className="flex items-center justify-center border-l bg-muted/10 hover:bg-muted/30 cursor-pointer transition-all" 
                onClick={() => setIsRightSidebarOpen(true)} 
                style={{ width: '24px' }}
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className={`border-l bg-muted/30 transition-all duration-300 ${isRightSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden flex flex-col`}>
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{rightSidebarTitle}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {rightSidebarContent}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedNoteSpace;
