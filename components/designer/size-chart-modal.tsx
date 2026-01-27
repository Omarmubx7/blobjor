'use client'

import React from 'react'

const HOODIE_SIZE_CHART = {
    title: "HOODIES SIZES 2026",
    columns: [
        { key: 'size', label: 'الحجم', labelEn: 'Size' },
        { key: 'length', label: 'الطول', labelEn: 'Length' },
        { key: 'chest', label: 'العرض', labelEn: 'Chest' }
    ],
    sizes: [
        { size: '22', length: '37', chest: '28' },
        { size: '26', length: '41', chest: '33' },
        { size: '30', length: '48', chest: '36' },
        { size: '34', length: '51', chest: '39' },
        { size: '36', length: '54', chest: '39' },
        { size: 'XS', length: '62', chest: '42' },
        { size: 'S', length: '64', chest: '49' },
        { size: 'M', length: '66', chest: '51' },
        { size: 'L', length: '68', chest: '54' },
        { size: 'XL', length: '69', chest: '56' },
        { size: '2XL', length: '70', chest: '58' },
        { size: '3XL', length: '72', chest: '60' },
        { size: '4XL', length: '74', chest: '64' },
        { size: '5XL', length: '77', chest: '67' }
    ]
}

interface SizeChartModalProps {
    open: boolean
    onClose: () => void
    productType: string
}

export function SizeChartModal({ open, onClose, productType }: SizeChartModalProps) {
    if (!open || productType !== 'hoodie') return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl mx-4 relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                    aria-label="إغلاق"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {HOODIE_SIZE_CHART.title}
                    </h2>
                    <p className="text-lg text-gray-600">جدول المقاسات - Size Chart</p>
                </div>

                {/* Hoodie Image/Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-600 rounded-2xl flex items-center justify-center">
                        <span className="text-6xl">🧥</span>
                    </div>
                </div>

                {/* Size Chart Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-900 to-slate-700">
                                {HOODIE_SIZE_CHART.columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-6 py-4 text-center border border-gray-300"
                                    >
                                        <div className="text-white font-bold">
                                            <div className="text-base">{col.label}</div>
                                            <div className="text-sm font-normal opacity-80">{col.labelEn}</div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {HOODIE_SIZE_CHART.sizes.map((sizeData, index) => (
                                <tr
                                    key={sizeData.size}
                                    className={`
                    ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    hover:bg-blue-50 transition-colors
                  `}
                                >
                                    <td className="px-6 py-3 text-center border border-gray-300">
                                        <span className="font-bold text-lg text-gray-900">
                                            {sizeData.size}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-center border border-gray-300">
                                        <span className="text-gray-700 font-medium">
                                            {sizeData.length} <span className="text-sm text-gray-500">سم</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-center border border-gray-300">
                                        <span className="text-gray-700 font-medium">
                                            {sizeData.chest} <span className="text-sm text-gray-500">سم</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Measurement Guide Image */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex-1 text-center">
                            <div className="text-gray-700 font-semibold mb-2">📏 الطول / Length</div>
                            <div className="text-sm text-gray-600">من الكتف إلى الأسفل</div>
                        </div>
                        <div className="w-px h-16 bg-gray-300"></div>
                        <div className="flex-1 text-center">
                            <div className="text-gray-700 font-semibold mb-2">📐 العرض / Chest</div>
                            <div className="text-sm text-gray-600">عرض الصدر من جهة لجهة</div>
                        </div>
                    </div>
                </div>

                {/* Close Button (Bottom) */}
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white font-bold rounded-xl hover:from-slate-800 hover:to-slate-600 transition-all"
                >
                    إغلاق
                </button>
            </div>
        </div>
    )
}
