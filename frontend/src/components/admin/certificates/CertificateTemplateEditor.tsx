import React, { useState, useEffect, useRef } from 'react';
import { Settings, Eye, EyeOff, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

export interface FieldPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  alignment: 'left' | 'center' | 'right';
  visible: boolean;
  color: string;
}

interface CertificateTemplateEditorProps {
  backgroundUrl: string;
  fieldPositions: Record<string, FieldPosition>;
  onChange: (positions: Record<string, FieldPosition>) => void;
}

const DraggableField = ({ 
  fieldKey, 
  fieldData, 
  isSelected, 
  onSelect, 
  onUpdate 
}: { 
  fieldKey: string, 
  fieldData: FieldPosition, 
  isSelected: boolean,
  onSelect: () => void,
  onUpdate: (data: FieldPosition) => void
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;
      
      const parent = fieldRef.current?.parentElement;
      if (!parent) return;

      const pWidth = parent.clientWidth;
      const pHeight = parent.clientHeight;
      
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      
      const dxPct = (dx / pWidth) * 100;
      const dyPct = (dy / pHeight) * 100;
      
      if (isDragging) {
        onUpdate({
          ...fieldData,
          x: Math.max(0, Math.min(100 - fieldData.width, fieldData.x + dxPct)),
          y: Math.max(0, Math.min(100 - fieldData.height, fieldData.y + dyPct))
        });
      } else if (isResizing) {
        onUpdate({
          ...fieldData,
          width: Math.max(5, Math.min(100 - fieldData.x, fieldData.width + dxPct)),
          height: Math.max(2, Math.min(100 - fieldData.y, fieldData.height + dyPct))
        });
      }
      
      setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, startPos, fieldData, onUpdate]);

  if (!fieldData.visible) return null;

  return (
    <div
      ref={fieldRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${fieldData.x}%`,
        top: `${fieldData.y}%`,
        width: `${fieldData.width}%`,
        height: `${fieldData.height}%`,
        color: fieldData.color,
        border: isSelected ? '2px dashed #f97316' : '1px dashed rgba(0,0,0,0.1)',
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        alignItems: fieldKey === 'qrCode' ? 'center' : 'flex-start',
        justifyContent: fieldData.alignment === 'left' ? 'flex-start' : fieldData.alignment === 'right' ? 'flex-end' : 'center',
        backgroundColor: isSelected ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
        userSelect: 'none',
        zIndex: isSelected ? 10 : 1
      }}
      className="group"
    >
      {fieldKey === 'qrCode' ? (
        <div className="w-full h-full border-2 border-gray-800 bg-white flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-gray-800" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%, 20% 20%, 20% 80%, 80% 80%, 80% 20%, 100% 20%, 100% 100%, 0% 100%)' }} />
        </div>
      ) : (
        <span style={{ fontSize: `${fieldData.fontSize}px`, lineHeight: 1, whiteSpace: 'nowrap' }}>
          [{fieldKey}]
        </span>
      )}
      
      {isSelected && (
        <div 
          onMouseDown={handleResizeMouseDown}
          className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-orange-500 border-2 border-white rounded-full cursor-se-resize"
        />
      )}
    </div>
  );
};

const CertificateTemplateEditor = ({ backgroundUrl, fieldPositions, onChange }: CertificateTemplateEditorProps) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const updateField = (key: string, data: FieldPosition) => {
    onChange({
      ...fieldPositions,
      [key]: data
    });
  };

  const handleEditorClick = () => {
    setSelectedField(null);
  };

  const fieldLabels: Record<string, string> = {
    studentName: 'Student Name',
    courseName: 'Course Name',
    instructorName: 'Instructor Name',
    completionDate: 'Completion Date',
    issueDate: 'Issue Date',
    certificateId: 'Certificate ID',
    qrCode: 'QR Code'
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-gray-50 p-6 rounded-xl border border-border h-full overflow-hidden">
      {/* Visual Editor Area */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-gray-200 p-8 rounded-lg shadow-inner relative min-h-[500px]">
        {backgroundUrl ? (
          <div 
            className="relative shadow-2xl bg-white mx-auto"
            style={{ 
              width: '800px', 
              aspectRatio: '1.414 / 1', // standard A4 Landscape approx
              backgroundImage: `url(${backgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onMouseDown={handleEditorClick}
          >
            {Object.entries(fieldPositions).map(([key, data]) => (
              <DraggableField 
                key={key}
                fieldKey={key}
                fieldData={data}
                isSelected={selectedField === key}
                onSelect={() => setSelectedField(key)}
                onUpdate={(newData) => updateField(key, newData)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 h-full w-full min-h-[300px]">
            <EyeOff className="w-12 h-12 mb-4" />
            <p>Upload a background image to start positioning fields</p>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <div className="w-full lg:w-80 bg-white p-5 rounded-lg border border-border shadow-sm flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        <div>
          <h3 className="font-bold text-heading flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4" />
            Field Settings
          </h3>
          <p className="text-sm text-body mb-4">Click a field on the certificate to edit its properties, or toggle visibility below.</p>
          
          <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-2">
            {Object.entries(fieldPositions).map(([key, data]) => (
              <div 
                key={key} 
                className={`flex items-center justify-between p-2 rounded-md border cursor-pointer ${selectedField === key ? 'border-orange-500 bg-orange-50' : 'border-border hover:bg-gray-50'}`}
                onClick={() => setSelectedField(key)}
              >
                <span className="text-sm font-medium">{fieldLabels[key] || key}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    updateField(key, { ...data, visible: !data.visible });
                  }}
                  className={`p-1.5 rounded-md ${data.visible ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-gray-200'}`}
                >
                  {data.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedField && fieldPositions[selectedField] && (
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-bold text-sm text-heading">{fieldLabels[selectedField]} Properties</h4>
            
            {selectedField !== 'qrCode' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-caption mb-1">Font Size (px)</label>
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-gray-400" />
                    <input 
                      type="number" 
                      value={fieldPositions[selectedField].fontSize}
                      onChange={(e) => updateField(selectedField, { ...fieldPositions[selectedField], fontSize: parseInt(e.target.value) || 12 })}
                      className="w-full px-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-caption mb-1">Text Alignment</label>
                  <div className="flex rounded-md border border-border overflow-hidden">
                    {(['left', 'center', 'right'] as const).map(align => (
                      <button
                        key={align}
                        onClick={() => updateField(selectedField, { ...fieldPositions[selectedField], alignment: align })}
                        className={`flex-1 py-1.5 flex justify-center ${fieldPositions[selectedField].alignment === align ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                      >
                        {align === 'left' ? <AlignLeft className="w-4 h-4" /> : align === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-caption mb-1">Color</label>
                  <input 
                    type="color" 
                    value={fieldPositions[selectedField].color}
                    onChange={(e) => updateField(selectedField, { ...fieldPositions[selectedField], color: e.target.value })}
                    className="w-full h-8 cursor-pointer rounded-md border border-border p-0"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-caption mb-1">X Pos (%)</label>
                <input 
                  type="number" 
                  value={Math.round(fieldPositions[selectedField].x)}
                  onChange={(e) => updateField(selectedField, { ...fieldPositions[selectedField], x: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-caption mb-1">Y Pos (%)</label>
                <input 
                  type="number" 
                  value={Math.round(fieldPositions[selectedField].y)}
                  onChange={(e) => updateField(selectedField, { ...fieldPositions[selectedField], y: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateTemplateEditor;
