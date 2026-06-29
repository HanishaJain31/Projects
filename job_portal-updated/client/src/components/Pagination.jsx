import styled from 'styled-components';

const PaginationWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
    justify-content: ${({ align }) => {
        switch (align) {
            case 'center':
                return 'center';
            case 'end':
                return 'flex-end';
            default:
                return 'space-between';
        }
    }};
`;

const TotalText = styled.span`
    color: ${({ theme }) => theme.mutedText};
    font-size: 14px;
`;

const Controls = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const Button = styled.button`
    min-width: 36px;
    padding: ${({ size }) =>
        size === 'md' ? '8px 14px' : '6px 10px'};
    border: 1px solid ${({ theme, active }) => active ? theme.accent : theme.border};
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s ease;

    background: ${({ theme, active }) =>
        active ? theme.accent : theme.surface};

    color: ${({ theme, active }) =>
        active ? '#fff' : theme.mutedText};

    &:hover:not(:disabled) {
        opacity: 0.85;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

const Ellipsis = styled.span`
    padding: 0 6px;
    color: ${({ theme }) => theme.mutedText};
`;

export default function Pagination({
    page,
    totalPages,
    total,
    onPageChange,
    label = 'records',
    align = 'between',
    size = 'sm',
}) {
    if (!totalPages || totalPages <= 0) return null;

    const pages = buildPageList(page, totalPages);
    console.log(total)

    return (
        <PaginationWrapper align={align}>
            {align === 'between' && total !== undefined && (
                <TotalText>
                    Total: <strong>{total}</strong> {label}
                </TotalText>
            )}

            <Controls>
                <Button
                    size={size}
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    ‹ Prev
                </Button>

                {pages.map((p, i) =>
                    p === '…' ? (
                        <Ellipsis key={i}>…</Ellipsis>
                    ) : (
                        <Button
                            key={p}
                            size={size}
                            active={p === page}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </Button>
                    )
                )}

                <Button
                    size={size}
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next ›
                </Button>
            </Controls>
        </PaginationWrapper>
    );
}

function buildPageList(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set([1, total, current]);

    if (current > 1) pages.add(current - 1);
    if (current < total) pages.add(current + 1);

    const sorted = [...pages].sort((a, b) => a - b);

    const result = [];

    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
            result.push('…');
        }

        result.push(sorted[i]);
    }

    return result;
}
