import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  Edit, 
  Eye, 
  Plus,
  X,
  FileText,
  Image,
  Code,
  Settings,
  Download,
  Upload
} from 'lucide-react';

interface AttackNoteSpaceProps {
  entity: any;
  entityType: 'methodology' | 'playbook' | 'technique' | 'payload' | 'atomic-vuln' | 'logic-flaw';
  onSave: (updatedEntity: any) => void;
  onClose: () => void;
  leftSidebarContent?: React.ReactNode;
  rightSidebarContent?: React.ReactNode;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  leftSidebarTitle?: string;
  rightSidebarTitle?: string;
}

export const AttackNoteSpace: React.FC<AttackNoteSpaceProps> = ({
  entity,
  entityType,
  onSave,
  onClose,
  leftSidebarContent,
  rightSidebarContent,
  showLeftSidebar = false,
  showRightSidebar = false,
  leftSidebarTitle = "Related Items",
  rightSidebarTitle = "Suggestions"
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntity, setEditedEntity] = useState(entity);
  const [activeTab, setActiveTab] = useState('content');
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
    switch (entityType) {
      case 'methodology':
        return editedEntity.contentMd || editedEntity.description || '';
      case 'playbook':
        return editedEntity.contentMd || '';
      case 'technique':
        return editedEntity.contentMd || editedEntity.description || '';
      case 'atomic-vuln':
        return editedEntity.detectionExploitationMd || '';
      case 'logic-flaw':
        return editedEntity.detectionTestsMd || '';
      case 'payload':
        return editedEntity.payloadContent || '';
      default:
        return '';
    }
  };

  const updateMainContent = (content: string) => {
    const updatedEntity = { ...editedEntity };
    switch (entityType) {
      case 'methodology':
        updatedEntity.contentMd = content;
        break;
      case 'playbook':
        updatedEntity.contentMd = content;
        break;
      case 'technique':
        updatedEntity.contentMd = content;
        break;
      case 'atomic-vuln':
        updatedEntity.detectionExploitationMd = content;
        break;
      case 'logic-flaw':
        updatedEntity.detectionTestsMd = content;
        break;
      case 'payload':
        updatedEntity.payloadContent = content;
        break;
    }
    setEditedEntity(updatedEntity);
  };

  const getDiagramContent = () => {
    return editedEntity.diagramMd || editedEntity.workflowDiagramMd || '';
  };

  const updateDiagramContent = (content: string) => {
    const updatedEntity = { ...editedEntity };
    if ('diagramMd' in editedEntity) {
      updatedEntity.diagramMd = content;
    } else if ('workflowDiagramMd' in editedEntity) {
      updatedEntity.workflowDiagramMd = content;
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
              {entityType.charAt(0).toUpperCase() + entityType.slice(1).replace('-', ' ')}
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
          <div className={`border-r bg-muted/30 transition-all duration-300 ${isLeftSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden flex flex-col`}>
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{leftSidebarTitle}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                >
                  {isLeftSidebarOpen ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4">
                {leftSidebarContent}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Content Area - Independent scroll context */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Tabs - Fixed */}
          <div className="border-b flex-shrink-0">
            <div className="flex space-x-4 px-4">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'content' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Content
              </button>
              {(entityType === 'playbook' || entityType === 'logic-flaw') && (
                <button
                  onClick={() => setActiveTab('diagram')}
                  className={`py-2 px-1 border-b-2 text-sm font-medium ${
                    activeTab === 'diagram' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Code className="h-4 w-4 inline mr-2" />
                  Diagram
                </button>
              )}
            </div>
          </div>

          {/* Content Editor - Scrollable */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'content' ? (
              <div className="h-full">
                {isEditing ? (
                  <Textarea
                    ref={textareaRef}
                    value={getMainContent()}
                    onChange={(e) => updateMainContent(e.target.value)}
                    placeholder="Enter your content here (Markdown supported)..."
                    className="h-full resize-none font-mono border-0 focus-visible:ring-0"
                  />
                ) : (
                  <ScrollArea className="h-full">
                    <div className="prose prose-sm max-w-none bg-muted/30 p-4 m-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {getMainContent() || 'No content available. Click Edit to add content.'}
                      </pre>
                    </div>
                  </ScrollArea>
                )}
              </div>
            ) : activeTab === 'diagram' ? (
              <div className="h-full overflow-hidden">
                {isEditing ? (
                  <div className="p-4 h-full flex flex-col">
                    <Label className="mb-2">Workflow/Process Diagram (Mermaid.js or plain text)</Label>
                    <Textarea
                      value={getDiagramContent()}
                      onChange={(e) => updateDiagramContent(e.target.value)}
                      placeholder="Enter diagram code or description..."
                      className="flex-1 resize-none font-mono"
                    />
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="prose prose-sm max-w-none bg-muted/30 p-4 m-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {getDiagramContent() || 'No diagram available. Click Edit to add a diagram.'}
                      </pre>
                    </div>
                  </ScrollArea>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Sidebar - Independent scroll context */}
        {showRightSidebar && (
          <div className={`border-l bg-muted/30 transition-all duration-300 ${isRightSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden flex flex-col`}>
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{rightSidebarTitle}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                >
                  {isRightSidebarOpen ? <X className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4">
                {rightSidebarContent}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
