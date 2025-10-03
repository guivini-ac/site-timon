import React, { useRef, useCallback, useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Label } from '../../ui/label';
import { cn } from '../../ui/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const MenuBar = ({ 
  editorRef, 
  updateContent 
}: { 
  editorRef: React.RefObject<HTMLDivElement>;
  updateContent: () => void;
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  }, [editorRef, updateContent]);

  const addLink = useCallback(() => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setLinkOpen(false);
    }
  }, [linkUrl, execCommand]);

  const addImage = useCallback(() => {
    if (imageUrl) {
      execCommand('insertImage', imageUrl);
      setImageUrl('');
      setImageOpen(false);
    }
  }, [imageUrl, execCommand]);

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-8 w-8 p-0",
        isActive && "bg-primary text-primary-foreground"
      )}
    >
      {children}
    </Button>
  );

  return (
    <div className="border-b border-border p-2 flex flex-wrap gap-1 bg-muted/50">
      {/* Text formatting */}
      <div className="flex gap-1 border-r border-border pr-2 mr-2">
        <ToolbarButton
          onClick={() => execCommand('bold')}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('italic')}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('underline')}
          title="Sublinhado"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('strikeThrough')}
          title="Tachado"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r border-border pr-2 mr-2">
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'h1')}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'h2')}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'h3')}
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Alignment */}
      <div className="flex gap-1 border-r border-border pr-2 mr-2">
        <ToolbarButton
          onClick={() => execCommand('justifyLeft')}
          title="Alinhar à esquerda"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('justifyCenter')}
          title="Centralizar"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('justifyRight')}
          title="Alinhar à direita"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('justifyFull')}
          title="Justificar"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r border-border pr-2 mr-2">
        <ToolbarButton
          onClick={() => execCommand('insertUnorderedList')}
          title="Lista com marcadores"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('insertOrderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Special formatting */}
      <div className="flex gap-1 border-r border-border pr-2 mr-2">
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'blockquote')}
          title="Citação"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'pre')}
          title="Código"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Links and Images */}
      <div className="flex gap-1 border-r border-border pr-2 mr-2">
        <Popover open={linkOpen} onOpenChange={setLinkOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Inserir link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkUrl">URL do Link</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://exemplo.com"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addLink} size="sm">
                  Adicionar Link
                </Button>
                <Button 
                  onClick={() => {
                    execCommand('unlink');
                    setLinkOpen(false);
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  Remover Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={imageOpen} onOpenChange={setImageOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Inserir imagem"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <Button onClick={addImage} size="sm">
                Adicionar Imagem
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <ToolbarButton
          onClick={() => execCommand('undo')}
          title="Desfazer"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => execCommand('redo')}
          title="Refazer"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Escreva seu conteúdo aqui...", 
  className,
  id 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const updateContent = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    updateContent();
  }, [updateContent]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  }, [updateContent]);

  return (
    <div className={cn("border border-border rounded-md overflow-hidden bg-background", className)}>
      <MenuBar editorRef={editorRef} updateContent={updateContent} />
      <div
        ref={editorRef}
        id={id}
        contentEditable
        className="min-h-[200px] p-4 prose prose-sm max-w-none focus:outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:ml-6 [&_ol]:ml-6 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded [&_pre]:font-mono [&_pre]:text-sm [&_a]:text-primary [&_a]:underline [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{
          minHeight: '200px',
        }}
      />
    </div>
  );
}