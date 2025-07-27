import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationControls = ({
                                page,
                                totalPages,
                                onPrev,
                                onNext,
                                loading,
                                hasPrev = true,
                                hasNext = true,
                                onPageChange,
                            }) => {
    // Optionally render numbered pages
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
            <Pagination.Item
                key={i}
                active={i === page}
                onClick={() => onPageChange && onPageChange(i)}
                disabled={loading}
            >
                {i}
            </Pagination.Item>
        );
    }

    return (
        <Pagination>
            <Pagination.Prev onClick={onPrev} disabled={!hasPrev || loading} />
            {pages}
            <Pagination.Next onClick={onNext} disabled={!hasNext || loading} />
        </Pagination>
    );
};

export default PaginationControls;