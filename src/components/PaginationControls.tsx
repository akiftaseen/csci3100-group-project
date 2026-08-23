import classNames from 'classnames'
import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export interface PaginationControlsProps {
  indexOfFirstItem: number | undefined
  indexOfLastItem: number | undefined
  numberOfItems: number | undefined
  pageSize: number
  onPrevClick?: () => void
  onNextClick?: () => void
  onPageClick?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  indexOfFirstItem,
  indexOfLastItem,
  numberOfItems,
  pageSize,
  onPrevClick,
  onNextClick,
  onPageClick,
  onPageSizeChange,
}) => {
  const noData =
    indexOfFirstItem == null || indexOfLastItem == null || numberOfItems == null

  type PaginationParams = typeof noData extends true ? number : null

  const totalPages = (
    !noData ? Math.ceil(numberOfItems / pageSize) : null
  ) as PaginationParams

  const currentPage = (
    !noData ? Math.ceil(indexOfFirstItem / pageSize) + 1 : null
  ) as PaginationParams

  const padding = 3
  const startPage = (
    !noData ? Math.max(1, currentPage! - padding) : null
  ) as PaginationParams
  const endPage = (
    !noData ? Math.min(totalPages!, currentPage! + padding) : null
  ) as PaginationParams

  const pages =
    !noData && totalPages! > 0
      ? Array.from(
          { length: endPage! - startPage! + 1 },
          (_, i) => i + startPage!,
        )
      : [1]

  return (
    <div className='mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm'>
      <p className='whitespace-nowrap text-foreground-light'>
        {!noData
          ? `Showing ${indexOfFirstItem + 1}-${Math.min(
              indexOfLastItem + 1,
              numberOfItems,
            )} of ${numberOfItems} items`
          : 'Showing -- of -- items'}
      </p>

      <div className='flex items-center gap-2'>
        <button
          onClick={onPrevClick}
          disabled={indexOfFirstItem === 0}
          aria-label='Previous page'
          className={classNames(
            'flex size-8 items-center justify-center rounded-md border border-foreground-light/50 transition-colors hover:bg-background-dark',
            indexOfFirstItem === 0 && 'opacity-50 cursor-not-allowed',
          )}
        >
          <FiChevronLeft />
        </button>

        <div className='flex items-center gap-1.5'>
          {pages.map((page) => (
            <button
              key={page}
              type='button'
              className={classNames(
                'flex size-8 items-center justify-center rounded-md border text-sm transition-colors',
                currentPage === page
                  ? 'border-foreground bg-foreground text-background font-semibold'
                  : 'border-foreground-light/50 hover:bg-background-dark',
              )}
              onClick={() => onPageClick?.(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              disabled={currentPage === page}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={onNextClick}
          disabled={noData || indexOfLastItem === numberOfItems - 1}
          aria-label='Next page'
          className={classNames(
            'flex size-8 items-center justify-center rounded-md border border-foreground-light/50 transition-colors hover:bg-background-dark',
            noData ||
              (indexOfLastItem === numberOfItems - 1 &&
                'opacity-50 cursor-not-allowed'),
          )}
        >
          <FiChevronRight />
        </button>
      </div>

      <label className='flex items-center gap-2 whitespace-nowrap text-foreground/70'>
        <span>Items per page</span>
        <select
          value={pageSize}
          onChange={
            onPageSizeChange
              ? (e) => onPageSizeChange(Number(e.target.value))
              : undefined
          }
          className='h-8 rounded-md border border-foreground-light/50 bg-background px-2 text-foreground'
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </label>
    </div>
  )
}

export default PaginationControls
