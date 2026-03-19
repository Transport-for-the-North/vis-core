import React, { useRef, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  NameCell,
  RankBadge,
  RotatingIcon,
  RowTr,
  ScoreCell,
  Title,
  ToggleButton,
} from "./ChartRenderer.styles";

export const RankingChart = ({ config, data, formatters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cols = config.columns || [];
  const rows = React.useMemo(
    () => cols.map((col) => ({ label: col.label ?? col.key, key: col.key })),
    [cols]
  );
  const ranks = config?.ranks;
  const nodeRefs = useRef(new Map());

  const getNodeRef = (key) => {
    if (!nodeRefs.current.has(key)) {
      nodeRefs.current.set(key, React.createRef());
    }
    return nodeRefs.current.get(key);
  };

  const sortedRows = React.useMemo(() => {
    if (ranks) {
      return [...rows].sort((a, b) => {
        const rankA = ranks[a.key] ?? Infinity;
        const rankB = ranks[b.key] ?? Infinity;
        return rankA - rankB;
      });
    }
    return rows;
  }, [rows, ranks]);

  const visibleRows = isOpen ? sortedRows : sortedRows.slice(0, 5);

  const fmt = {
    commify:
      formatters?.commify || ((v) => Number(v ?? 0).toLocaleString("en-GB")),
  };

  return (
    <div style={{ overflowX: "auto", margin: "10px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>{config.title}</Title>
        {rows.length > 5 ? (
          <ToggleButton onClick={() => setIsOpen(!isOpen)}>
            <RotatingIcon $isOpen={isOpen} />
          </ToggleButton>
        ) : null}
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          background: "transparent",
          border: "none",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: 32 }}></th>
            <th style={{ textAlign: "left", fontWeight: 600 }}>Name</th>
            <th style={{ textAlign: "right", fontWeight: 600 }}>Score</th>
          </tr>
        </thead>
        <TransitionGroup component="tbody">
          {visibleRows.map((row, idx) => {
            const val = data[row.key];
            const nodeRef = getNodeRef(row.key);
            return (
              <CSSTransition key={row.key} timeout={300} classNames="row" nodeRef={nodeRef}>
                <RowTr ref={nodeRef}>
                  <td>
                    <RankBadge>{ranks ? ranks[row.key] : idx + 1}</RankBadge>
                  </td>
                  <NameCell>{row.label}</NameCell>
                  <ScoreCell>{fmt.commify(val)}</ScoreCell>
                </RowTr>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
        {!isOpen && rows.length > 5 && (
          <RowTr>
            <td colSpan={3} style={{ color: "#888", paddingLeft: 32 }}>
              ...
            </td>
          </RowTr>
        )}
      </table>
    </div>
  );
};

export default RankingChart;