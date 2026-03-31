import React, { useState } from 'react'

type GridSystem = '12G' | '8G'
type BlockType = 'label' | 'textbox'

interface GridBlock {
  id: string
  type: BlockType
  gridSystem: GridSystem
  startCol: number
  startRow: number
  span: number
  text: string
}

const initialBlocks: GridBlock[] = [
  { id: 'b1', type: 'label', gridSystem: '12G', startCol: 1, startRow: 1, span: 2, text: 'Label 1' },
  { id: 'b2', type: 'textbox', gridSystem: '12G', startCol: 3, startRow: 1, span: 3, text: 'Input box 1' },
  { id: 'b3', type: 'label', gridSystem: '8G', startCol: 5, startRow: 2, span: 2, text: 'Label 8G' },
  { id: 'b4', type: 'textbox', gridSystem: '8G', startCol: 7, startRow: 2, span: 2, text: 'Text 8G' },
]

export default function App() {
  const [blocks, setBlocks] = useState<GridBlock[]>(initialBlocks)
  const [activeBlockId, setActiveBlockId] = useState<string>(initialBlocks[0].id)
  const [containerWidth, setContainerWidth] = useState<'1280' | '1600' | '1920' | 'fluid'>('1280')
  const [rowCount, setRowCount] = useState<number>(3)
  const [granularity, setGranularity] = useState<0.25 | 0.5 | 1>(0.5)

  const activeBlock = blocks.find((b) => b.id === activeBlockId) || blocks[0]

  const updateBlock = (patch: Partial<GridBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === activeBlockId ? { ...b, ...patch } : b))
    )
  }

  const addBlock = () => {
    const newId = Math.random().toString(36).substr(2, 6)
    const newBlock: GridBlock = {
      id: newId,
      type: 'label',
      gridSystem: '12G',
      startCol: 1,
      startRow: 1,
      span: 2,
      text: 'New Block',
    }
    setBlocks([...blocks, newBlock])
    setActiveBlockId(newId)
  }

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return
    const newBlocks = blocks.filter((b) => b.id !== id)
    setBlocks(newBlocks)
    if (activeBlockId === id) setActiveBlockId(newBlocks[0].id)
  }

  // The formulas to position the blocks from CSS variables
  // Left: calc((col - 1) * (width_of_1_col + 8px))
  // Width: calc(span * width_of_1_col + (span - 1) * 8px)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
      {/* Settings Panel */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm z-10 w-full shrink-0">
        <div className="max-w-[1920px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Grid 12G/8G Layout Tool</h1>
              <p className="text-sm text-gray-500">
                Visualize blocks positioned on the 12-column or 8-column grid in a single row.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Container Width:</label>
              <select
                className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={containerWidth}
                onChange={(e) => setContainerWidth(e.target.value as any)}
              >
                <option value="1280">1280px</option>
                <option value="1600">1600px</option>
                <option value="1920">1920px</option>
                <option value="fluid">Fluid (100%)</option>
              </select>

              <label className="text-sm font-medium">Rows:</label>
              <input
                type="number"
                min="1"
                max="20"
                className="border border-gray-300 rounded px-3 py-1.5 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={rowCount}
                onChange={(e) => setRowCount(parseInt(e.target.value) || 1)}
              />

              <label className="text-sm font-medium">Grid Granularity:</label>
              <select
                className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={granularity}
                onChange={(e) => setGranularity(parseFloat(e.target.value) as any)}
              >
                <option value={1}>Full Column (1)</option>
                <option value={0.5}>Half Column (0.5)</option>
                <option value={0.25}>Quarter Column (0.25)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            {/* Left Col: Block Selection */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Select Block
              </h2>
              <div className="flex flex-wrap gap-2">
                {blocks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBlockId(b.id)}
                    className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                      activeBlockId === b.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {b.gridSystem} - {b.text || b.type}
                  </button>
                ))}
                <button
                  onClick={addBlock}
                  className="px-3 py-1.5 text-sm rounded border border-dashed border-gray-400 bg-white hover:bg-gray-100 font-medium text-gray-600 flex items-center gap-1"
                >
                  + Add Block
                </button>
              </div>
            </div>

            {/* Right Col: Edit Active Block */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Edit Block Props
                </h2>
                <button
                  onClick={() => removeBlock(activeBlock.id)}
                  disabled={blocks.length === 1}
                  className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Remove Focus Block
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Grid System</span>
                  <select
                    className="border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500"
                    value={activeBlock.gridSystem}
                    onChange={(e) => updateBlock({ gridSystem: e.target.value as GridSystem })}
                  >
                    <option value="12G">12G (12 cols)</option>
                    <option value="8G">8G (8 cols)</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Type</span>
                  <select
                    className="border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500"
                    value={activeBlock.type}
                    onChange={(e) => updateBlock({ type: e.target.value as BlockType })}
                  >
                    <option value="label">Label</option>
                    <option value="textbox">TextBox</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Start Col (1-based)</span>
                  <input
                    type="number"
                    min="1"
                    step={granularity}
                    max={activeBlock.gridSystem === '12G' ? 12 : 8}
                    className="border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500"
                    value={activeBlock.startCol}
                    onChange={(e) => updateBlock({ startCol: parseFloat(e.target.value) || 1 })}
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Start Row (1-based)</span>
                  <input
                    type="number"
                    min="1"
                    max={rowCount}
                    className="border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500"
                    value={activeBlock.startRow}
                    onChange={(e) => updateBlock({ startRow: parseInt(e.target.value) || 1 })}
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Col Span</span>
                  <input
                    type="number"
                    min={granularity}
                    step={granularity}
                    max={activeBlock.gridSystem === '12G' ? 12 - activeBlock.startCol + 1 : 8 - activeBlock.startCol + 1}
                    className="border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500"
                    value={activeBlock.span}
                    onChange={(e) => updateBlock({ span: parseFloat(e.target.value) || granularity })}
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                  <span className="font-medium">Text / Value</span>
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500"
                    value={activeBlock.text}
                    onChange={(e) => updateBlock({ text: e.target.value })}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 w-full bg-[#f0f2f5] py-10 flex flex-col items-center">
        <div
          className="relative bg-white shadow-xl min-h-[500px] border border-gray-200 transition-all duration-300"
          style={{
            width: containerWidth === 'fluid' ? '100%' : `${containerWidth}px`,
            maxWidth: '100%',
          }}
        >
          {/* Main content wrapper with exact side margins mentioned in spreadsheet (20px) */}
          <div className="absolute inset-y-0 left-0 right-0 px-[20px] pointer-events-none">
            {/* The 12G Guides Overlay */}
            <div className="absolute inset-y-0 left-[20px] right-[20px] flex gap-[8px] opacity-[0.18]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 h-full bg-red-400 relative">
                  <span className="absolute -top-6 left-0 text-[10px] font-mono whitespace-nowrap text-red-700">12G-{i + 1}C</span>
                  <div className="absolute left-0 top-0 bottom-0 border-l border-red-700"></div>
                  <div className="absolute right-0 top-0 bottom-0 border-r border-red-700"></div>
                </div>
              ))}
            </div>

            {/* The 8G Guides Overlay */}
            <div className="absolute inset-y-0 left-[20px] right-[20px] flex gap-[8px] opacity-[0.18] mt-[250px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-1 h-full bg-blue-400 relative">
                  <span className="absolute -top-6 left-0 text-[10px] font-mono whitespace-nowrap text-blue-700">8G-{i + 1}C</span>
                  <div className="absolute left-0 top-0 bottom-0 border-l border-blue-700"></div>
                  <div className="absolute right-0 top-0 bottom-0 border-r border-blue-700"></div>
                </div>
              ))}
            </div>

            {/* Elements container */}
            <div className="relative w-full h-full pt-20 pointer-events-auto flex flex-col gap-6">
              <style>{`
                .grid-renderer {
                  --fw-12: calc((100% - 11 * 8px) / 12);
                  --fw-8: calc((100% - 7 * 8px) / 8);
                }
                .blk-12g { --fw: var(--fw-12); }
                .blk-8g { --fw: var(--fw-8); }
              `}</style>
              
              {Array.from({ length: rowCount }).map((_, rIndex) => {
                const currentRow = rIndex + 1;
                return (
                  <div key={currentRow} className="grid-renderer relative w-full h-[64px] bg-gray-100/50 border-t border-b border-dashed border-gray-400 rounded-sm">
                    <div className="absolute -top-5 left-0 text-[10px] font-mono text-gray-500 font-bold bg-white px-1">Row {currentRow}</div>
                    
                    {blocks.filter(b => b.startRow === currentRow).map((block) => {
                      const is12 = block.gridSystem === '12G'
                      const colClass = is12 ? 'blk-12g' : 'blk-8g'

                      const leftStr = `calc((${block.startCol} - 1) * (var(--fw) + 8px))`
                      const widthStr = `calc(${block.span} * var(--fw) + (${block.span} - 1) * 8px)`

                      return (
                        <div
                          key={block.id}
                          className={`absolute top-2 bottom-2 group transition-all duration-200 ${colClass}`}
                          style={{ left: leftStr, width: widthStr }}
                          title={`${block.type} in ${block.gridSystem} spanning ${block.span}`}
                          onClick={() => setActiveBlockId(block.id)}
                        >
                          {block.type === 'label' ? (
                            <div className={`cursor-pointer flex items-center justify-center h-full bg-[#e8eaed] text-gray-700 px-3 border border-gray-400 rounded-sm text-[13px] font-medium overflow-hidden ${activeBlockId === block.id ? 'ring-2 ring-blue-500 ring-offset-1 z-10 relative' : ''}`}>
                              <span className="truncate w-full text-center">{block.text}</span>
                            </div>
                          ) : (
                            <div className={`cursor-pointer flex flex-col justify-center h-full bg-[#f8f9fa] px-2 border border-gray-400 rounded-sm shadow-inner overflow-hidden ${activeBlockId === block.id ? 'ring-2 ring-blue-500 ring-offset-1 z-10 relative' : ''}`}>
                              <input 
                                type="text" 
                                disabled
                                value={block.text}
                                className="bg-transparent border border-gray-300 rounded-sm px-2 py-1 outline-none text-[13px] w-full font-sans truncate text-gray-800 pointer-events-none"
                                placeholder=""
                              />
                            </div>
                          )}
                          
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-mono bg-gray-800 text-white px-2 py-0.5 rounded pointer-events-none z-20">
                            {block.gridSystem} &bull; R{block.startRow}C{block.startCol} &bull; Span: {block.span}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Guide Setup moved outside the grid */}
        <div className="relative w-full text-sm text-gray-600 mt-8 max-w-3xl bg-white p-6 border border-gray-200 rounded shadow-sm">
          <p className="font-bold mb-3 text-gray-800 text-base">Guide Setup</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-red-500">Red columns:</strong> 12G Grid system</li>
            <li><strong className="text-blue-500">Blue columns:</strong> 8G Grid system (starts lower purely for visual clarity)</li>
            <li>Both use a fixed 8px grid gap and 20px padding left/right.</li>
            <li>Changing the container width accurately scales both systems together, maintaining exactly the calculations defined: <code className="bg-gray-100 px-1 py-0.5 rounded text-pink-600">left margin + ((no. after N - 1) * (N size per column + column gapsize))</code>.</li>
            <li>The blocks are overlaid in the <strong>same horizontal row container</strong> using CSS <code className="bg-gray-100 px-1 py-0.5 rounded text-pink-600">calc()</code> to position perfectly on either scale!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
