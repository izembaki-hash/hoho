'use client'

import { useState, useCallback, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, ZoomOut, Maximize, ChevronDown, ChevronUp, X, Network } from 'lucide-react'

// === Types ===
interface SubNode {
  id: string
  label: string
}

interface BranchNode {
  id: string
  label: string
  color: string
  bgColor: string
  borderColor: string
  hoverBg: string
  description: string
  subNodes: SubNode[]
}

// === Data ===
const branches: BranchNode[] = [
  {
    id: 'oral-expression',
    label: 'التعبير الشفهي',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'fill-emerald-500',
    borderColor: 'stroke-emerald-400',
    hoverBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    description: 'فن التعبير بالكلام المنطوق وإيصال الأفكار شفهياً بأسلوب مؤثر ومقنع',
    subNodes: [
      { id: 'khutba', label: 'الخطابة' },
      { id: 'muhadara', label: 'المحاضرة' },
      { id: 'mundhara', label: 'المناظرة' },
    ],
  },
  {
    id: 'written-expression',
    label: 'التعبير الكتابي',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'fill-amber-500',
    borderColor: 'stroke-amber-400',
    hoverBg: 'bg-amber-50 dark:bg-amber-950/30',
    description: 'فن صياغة الأفكار كتابياً بلغة سليمة وأسلوب واضح ومؤثر',
    subNodes: [
      { id: 'maqal', label: 'المقال' },
      { id: 'risala', label: 'الرسالة' },
      { id: 'talkhis', label: 'التلخيص' },
    ],
  },
  {
    id: 'punctuation',
    label: 'علامات الترقيم',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'fill-teal-500',
    borderColor: 'stroke-teal-400',
    hoverBg: 'bg-teal-50 dark:bg-teal-950/30',
    description: 'الرموز المستخدمة في الكتابة لتنظيم النص وتوضيح المعنى وتحديد بنية الجمل',
    subNodes: [
      { id: 'fasila', label: 'الفاصلة' },
      { id: 'nuqta', label: 'النقطة' },
    ],
  },
  {
    id: 'rhetoric',
    label: 'البلاغة',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'fill-rose-500',
    borderColor: 'stroke-rose-400',
    hoverBg: 'bg-rose-50 dark:bg-rose-950/30',
    description: 'علم يبحث عن كيفية تأدية المعنى بطرق مختلفة لتحقيق التأثير والإقناع',
    subNodes: [
      { id: 'bayan', label: 'البيان' },
      { id: 'maani', label: 'المعاني' },
    ],
  },
  {
    id: 'grammar',
    label: 'النحو',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'fill-purple-500',
    borderColor: 'stroke-purple-400',
    hoverBg: 'bg-purple-50 dark:bg-purple-950/30',
    description: 'علم يبحث في أحوال أواخر الكلمات العربية من حيث الإعراب والبناء',
    subNodes: [
      { id: 'iirab', label: 'الإعراب' },
      { id: 'binaa', label: 'البناء' },
    ],
  },
  {
    id: 'morphology',
    label: 'الصرف',
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'fill-sky-500',
    borderColor: 'stroke-sky-400',
    hoverBg: 'bg-sky-50 dark:bg-sky-950/30',
    description: 'علم يبحث في بنية الكلمة وتحولاتها وصيغها المختلفة في اللغة العربية',
    subNodes: [
      { id: 'tasreef', label: 'التصريف' },
      { id: 'ishtiqaq', label: 'الاشتقاق' },
    ],
  },
  {
    id: 'oratory-art',
    label: 'فن الخطابة',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'fill-orange-500',
    borderColor: 'stroke-orange-400',
    hoverBg: 'bg-orange-50 dark:bg-orange-950/30',
    description: 'فن الخطابة وإلقاء الكلمات أمام الجمهور بأسلوب مؤثر يدمج بين الإقناع والإمتاع',
    subNodes: [
      { id: 'ilqa', label: 'الإلقاء' },
      { id: 'iqnaa', label: 'الإقناع' },
    ],
  },
  {
    id: 'creative-writing',
    label: 'الكتابة الإبداعية',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'fill-pink-500',
    borderColor: 'stroke-pink-400',
    hoverBg: 'bg-pink-50 dark:bg-pink-950/30',
    description: 'فن الكتابة الأدبية الإبداعية التي تدمج بين الخيال والتعبير الفني',
    subNodes: [
      { id: 'qissa', label: 'القصة' },
      { id: 'shir', label: 'الشعر' },
    ],
  },
]

// Color mapping for SVG fills/strokes
const colorMap: Record<string, { fill: string; stroke: string; light: string; text: string; line: string }> = {
  'oral-expression': { fill: '#10b981', stroke: '#34d399', light: '#d1fae5', text: '#065f46', line: '#6ee7b7' },
  'written-expression': { fill: '#f59e0b', stroke: '#fbbf24', light: '#fef3c7', text: '#92400e', line: '#fcd34d' },
  'punctuation': { fill: '#14b8a6', stroke: '#2dd4bf', light: '#ccfbf1', text: '#134e4a', line: '#5eead4' },
  'rhetoric': { fill: '#f43f5e', stroke: '#fb7185', light: '#ffe4e6', text: '#9f1239', line: '#fda4af' },
  'grammar': { fill: '#a855f7', stroke: '#c084fc', light: '#f3e8ff', text: '#6b21a8', line: '#d8b4fe' },
  'morphology': { fill: '#0ea5e9', stroke: '#38bdf8', light: '#e0f2fe', text: '#075985', line: '#7dd3fc' },
  'oratory-art': { fill: '#f97316', stroke: '#fb923c', light: '#ffedd5', text: '#9a3412', line: '#fdba74' },
  'creative-writing': { fill: '#ec4899', stroke: '#f472b6', light: '#fce7f3', text: '#9d174d', line: '#f9a8d4' },
}

// Sub-node descriptions for tooltips
const subNodeDescriptions: Record<string, string> = {
  'khutba': 'فن إلقاء الكلمة أمام جمهور في مناسبة رسمية أو اجتماعية',
  'muhadara': 'عرض شفهي منظم لموضوع علمي أو ثقافي أمام مستمعين',
  'mundhara': 'حوار منظّم بين طرفين حول موضوع ما بهدف إثبات صحة رأي',
  'maqal': 'نثر قصير يعالج فكرة أو موضوعاً بعينه بأسلوب حُر',
  'risala': 'كتابة موجهة إلى شخص أو جهة بغرض التواصل الرسمي أو الشخصي',
  'talkhis': 'اختزال النص الأصلي مع الحفاظ على أفكاره الرئيسية',
  'fasila': 'علامة ترقيم (،) تستخدم للفصل بين أجزاء الجملة',
  'nuqta': 'علامة ترقيم (.) تدل على نهاية الجملة التامة',
  'bayan': 'علم البيان: دراسة طرق التعبير عن المعنى الواحد بطرق مختلفة',
  'maani': 'علم المعاني: دراسة أحوال الجملة العربية من حيث تأدية المعنى',
  'iirab': 'تغيير أواخر الكلمات بحسب العوامل الداخلة عليها',
  'binaa': 'ثبات آخر الكلمة على حالة واحدة مهما تغيرت العوامل',
  'tasreef': 'تحويل الكلمة إلى صيغ مختلفة مع الحفاظ على جذرها',
  'ishtiqaq': 'اشتقاق كلمات جديدة من جذر لغوي مشترك',
  'ilqa': 'فن تقديم الكلام شفهياً بإلقاء مؤثر وجذاب',
  'iqnaa': 'فن إقناع المستمع بالحجج والأدلة المنطقية',
  'qissa': 'نص أدبي سردي يتناول أحداثاً وشخصيات في إطار زمني ومكاني',
  'shir': 'كلام موزون ومقفى يعبر عن العواطف والأفكار بصور فنية',
}

export default function KnowledgeMap() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [expanded, setExpanded] = useState(true)
  const [tooltipData, setTooltipData] = useState<{ id: string; label: string; description: string; x: number; y: number } | null>(null)

  // SVG dimensions
  const svgWidth = 800
  const svgHeight = 700
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  const branchRadius = 200
  const subRadius = 310

  // Calculate branch positions (radial)
  const branchPositions = useMemo(() => {
    return branches.map((branch, i) => {
      const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2
      return {
        x: centerX + branchRadius * Math.cos(angle),
        y: centerY + branchRadius * Math.sin(angle),
        angle,
        branch,
      }
    })
  }, [centerX, centerY, branchRadius])

  // Calculate sub-node positions
  const subNodePositions = useMemo(() => {
    const positions: { id: string; x: number; y: number; parentId: string }[] = []
    branchPositions.forEach(({ x, y, angle, branch }) => {
      const subCount = branch.subNodes.length
      const spreadAngle = Math.PI / 6 // 30 degrees spread
      branch.subNodes.forEach((sub, j) => {
        const subAngle = angle + (j - (subCount - 1) / 2) * (spreadAngle / Math.max(subCount - 1, 1))
        positions.push({
          id: sub.id,
          x: x + 110 * Math.cos(subAngle),
          y: y + 110 * Math.sin(subAngle),
          parentId: branch.id,
        })
      })
    })
    return positions
  }, [branchPositions])

  // Is a node highlighted (hovered or selected)
  const isNodeHighlighted = useCallback((nodeId: string) => {
    if (!hoveredNode) return true
    if (hoveredNode === nodeId) return true
    // Check if it's a branch and this is its sub-node
    const branch = branches.find(b => b.id === hoveredNode)
    if (branch && branch.subNodes.some(s => s.id === nodeId)) return true
    // Check if it's a sub-node and this is its parent branch
    const subPos = subNodePositions.find(s => s.id === hoveredNode)
    if (subPos && subPos.parentId === nodeId) return true
    // Center is always highlighted if hovered node exists
    if (nodeId === 'center') return true
    return false
  }, [hoveredNode, subNodePositions])

  const isNodeDimmed = useCallback((nodeId: string) => {
    return !isNodeHighlighted(nodeId)
  }, [isNodeHighlighted])

  // Handle node click
  const handleNodeClick = useCallback((id: string, label: string, description: string, x: number, y: number) => {
    if (selectedNode === id) {
      setSelectedNode(null)
      setTooltipData(null)
    } else {
      setSelectedNode(id)
      setTooltipData({ id, label, description, x, y })
    }
  }, [selectedNode])

  // Zoom controls
  const handleZoomIn = useCallback(() => setZoom(z => Math.min(z + 0.2, 2)), [])
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - 0.2, 0.5)), [])
  const handleReset = useCallback(() => { setZoom(1); setSelectedNode(null); setTooltipData(null) }, [])
  const toggleExpand = useCallback(() => setExpanded(e => !e), [])

  return (
    <Card className="gradient-border-animate overflow-hidden" dir="rtl">
      {/* Gradient top bar */}
      <div className="h-1.5 bg-gradient-to-l from-emerald-500 via-amber-500 to-teal-500" />

      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">خريطة المعرفة</h3>
              <p className="text-xs text-muted-foreground">اضغط على أي عقدة للاستزادة</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut} aria-label="تصغير">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="text-[0.65rem] px-2 tabular-nums min-w-[3.5rem] text-center">
              {Math.round(zoom * 100)}%
            </Badge>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn} aria-label="تكبير">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleReset} aria-label="إعادة ضبط">
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={toggleExpand}>
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{expanded ? 'طي الكل' : 'توسيع الكل'}</span>
            </Button>
          </div>
        </div>

        {/* SVG Knowledge Map (Desktop) */}
        <div className="hidden sm:block overflow-auto rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 dark:from-muted/10 dark:to-muted/5 relative">
          <motion.svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            width="100%"
            style={{ maxHeight: '600px', minHeight: '400px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2}) scale(${zoom}) translate(${-svgWidth / 2}, ${-svgHeight / 2})`}>
              {/* Lines from center to branches */}
              {branchPositions.map(({ x, y, branch }, i) => (
                <motion.line
                  key={`line-center-${branch.id}`}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke={colorMap[branch.id].line}
                  strokeWidth={2.5}
                  opacity={hoveredNode && isNodeDimmed(branch.id) ? 0.15 : 0.5}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: hoveredNode && isNodeDimmed(branch.id) ? 0.15 : 0.5 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  strokeLinecap="round"
                />
              ))}

              {/* Lines from branches to sub-nodes */}
              {expanded && branchPositions.map(({ x, y, branch }) =>
                branch.subNodes.map((sub, j) => {
                  const subPos = subNodePositions.find(s => s.id === sub.id)
                  if (!subPos) return null
                  return (
                    <motion.line
                      key={`line-${branch.id}-${sub.id}`}
                      x1={x}
                      y1={y}
                      x2={subPos.x}
                      y2={subPos.y}
                      stroke={colorMap[branch.id].line}
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      opacity={hoveredNode && isNodeDimmed(sub.id) ? 0.1 : 0.4}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: hoveredNode && isNodeDimmed(sub.id) ? 0.1 : 0.4 }}
                      transition={{ delay: 0.6 + j * 0.08, duration: 0.4 }}
                      strokeLinecap="round"
                    />
                  )
                })
              )}

              {/* Center node */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: hoveredNode && hoveredNode !== 'center' ? 0.6 : 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                onClick={() => handleNodeClick('center', 'التحرير الكتابي والشفهي', 'منصة تعليمية متكاملة في فنون التحرير الكتابي والشفهي للغة العربية', centerX, centerY)}
                onMouseEnter={() => setHoveredNode('center')}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                <defs>
                  <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
                  </radialGradient>
                </defs>
                <circle cx={centerX} cy={centerY} r={52} fill="url(#centerGradient)" className="drop-shadow-lg" />
                <circle cx={centerX} cy={centerY} r={52} fill="none" stroke="#34d399" strokeWidth={2} opacity={0.6} />
                <text x={centerX} y={centerY - 5} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Cairo, sans-serif">
                  التحرير
                </text>
                <text x={centerX} y={centerY + 12} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Cairo, sans-serif">
                  الكتابي والشفهي
                </text>
              </motion.g>

              {/* Branch nodes */}
              {branchPositions.map(({ x, y, branch }, i) => (
                <motion.g
                  key={branch.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: isNodeDimmed(branch.id) ? 0.35 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 + i * 0.08 }}
                  onClick={() => handleNodeClick(branch.id, branch.label, branch.description, x, y)}
                  onMouseEnter={() => setHoveredNode(branch.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={36}
                    fill={colorMap[branch.id].fill}
                    opacity={0.9}
                    className="drop-shadow-md"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={36}
                    fill="none"
                    stroke={colorMap[branch.id].stroke}
                    strokeWidth={2}
                    opacity={0.5}
                  />
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="Cairo, sans-serif"
                  >
                    {branch.label}
                  </text>
                </motion.g>
              ))}

              {/* Sub-nodes */}
              {expanded && subNodePositions.map((subPos, i) => {
                const colors = colorMap[subPos.parentId]
                return (
                  <motion.g
                    key={subPos.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: isNodeDimmed(subPos.id) ? 0.25 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 + i * 0.05 }}
                    onClick={() => handleNodeClick(subPos.id, subPos.id, subNodeDescriptions[subPos.id] || '', subPos.x, subPos.y)}
                    onMouseEnter={() => setHoveredNode(subPos.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={subPos.x}
                      cy={subPos.y}
                      r={26}
                      fill="white"
                      stroke={colors.fill}
                      strokeWidth={2}
                      opacity={0.95}
                    />
                    <circle
                      cx={subPos.x}
                      cy={subPos.y}
                      r={22}
                      fill={colors.light}
                      opacity={0.6}
                    />
                    <text
                      x={subPos.x}
                      y={subPos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={colors.text}
                      fontSize="9.5"
                      fontWeight="600"
                      fontFamily="Cairo, sans-serif"
                    >
                      {branches.find(b => b.id === subPos.parentId)?.subNodes.find(s => s.id === subPos.id)?.label || subPos.id}
                    </text>
                  </motion.g>
                )
              })}
            </g>
          </motion.svg>

          {/* Tooltip */}
          <AnimatePresence>
            {tooltipData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-xl max-h-40 overflow-auto"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm mb-1">{tooltipData.label}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tooltipData.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => { setSelectedNode(null); setTooltipData(null) }}
                    aria-label="إغلاق"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Tree/List Layout */}
        <div className="sm:hidden space-y-3">
          {/* Center topic */}
          <div className="text-center p-4 rounded-xl bg-gradient-to-l from-emerald-500 to-emerald-700 text-white">
            <p className="font-bold text-base">التحرير الكتابي والشفهي</p>
            <p className="text-emerald-100 text-xs mt-1">منصة تعليمية متكاملة في فنون التحرير</p>
          </div>

          {/* Branches as accordion-style list */}
          <div className="space-y-2">
            {branches.map((branch, i) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <button
                  className="w-full text-right"
                  onClick={() => handleNodeClick(branch.id, branch.label, branch.description, 0, 0)}
                >
                  <div className={`p-3 rounded-xl border transition-all duration-300 ${selectedNode === branch.id ? `${branch.hoverBg} border-current shadow-sm` : 'bg-card border-border/50 hover:border-border'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: colorMap[branch.id].fill }}>
                        {branch.label.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm ${selectedNode === branch.id ? branch.color : ''}`}>{branch.label}</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${selectedNode === branch.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {selectedNode === branch.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pr-6 mt-1 space-y-1.5">
                        <p className="text-xs text-muted-foreground leading-relaxed px-2 py-1">{branch.description}</p>
                        {expanded && branch.subNodes.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[branch.id].fill }} />
                            <span className="text-sm font-medium">{sub.label}</span>
                            {subNodeDescriptions[sub.id] && (
                              <span className="text-[0.65rem] text-muted-foreground flex-1 text-left truncate">— {subNodeDescriptions[sub.id]}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {branches.map((branch) => (
            <div key={branch.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorMap[branch.id].fill }} />
              <span className="text-[0.65rem] text-muted-foreground">{branch.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
