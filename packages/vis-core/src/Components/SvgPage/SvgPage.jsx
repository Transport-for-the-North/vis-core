import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from 'services';
import {
  normaliseText,
  normaliseAssetPath,
  normaliseRows,
  buildPathWithQuery,
  ruleMatchesSelectedValue,
  resolveSvgUrl,
  applyWhereConditions,
  sortOptions,
} from 'utils';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 24px;
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: inherit;
`;

const Subtitle = styled.p`
  margin: 0 0 24px 0;
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  font-family: inherit;
`;

const LegendSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const LegendsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LegendItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const LegendItemTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: inherit;
`;

const LegendWrapper = styled.div`
  width: 100%;
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LegendImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 110px;
  object-fit: contain;
`;

const CaveatSection = styled.div`
  background: #fff8e1;
  border-left: 4px solid #ffa726;
  border-radius: 8px;
  padding: 12px 16px;
  flex: 1;
  min-width: 300px;
`;

const CaveatText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #5f4e00;
  line-height: 1.4;
  font-family: inherit;
`;

const CaveatTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #5f4e00;
  font-family: inherit;
`;

const CaveatsContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const SchematicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(800px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: box-shadow 0.3s ease;
  border: 2px solid transparent;
`;

const PlaceholderCard = styled(Card)`
  border: 2px dashed #d1d5db;
  background: #fafbfc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  cursor: default;
  transition: all 0.3s ease;
  padding: 24px;
`;

const PlaceholderText = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  font-family: inherit;
`;

const CardTitle = styled.div`
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitleText = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: inherit;
`;

const CardSubtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #6b7280;
  font-family: inherit;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 400px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
  
  img, svg {
    min-width: 100%;
    min-height: 100%;
    display: block;
    object-fit: contain;
  }
`;

const CardActions = styled.div`
  padding: 12px 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
`;

const RemoveButton = styled.button`
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  
  &:hover {
    background: #dc2626;
    color: white;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
`;

const ModalTitle = styled.h2`
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: inherit;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  font-family: inherit;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
  
  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
`;

const PrimaryButton = styled(Button)`
  background: #2563eb;
  color: white;
  
  &:hover {
    background: #1d4ed8;
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const legendSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 80"%3E%3Crect fill="%23f3f4f6" width="800" height="80"/%3E%3Ctext x="20" y="25" font-size="14" fill="%23374151" font-weight="bold"%3ELEGEND%3C/text%3E%3Ccircle cx="30" cy="50" r="8" fill="%232563eb"/%3E%3Ctext x="50" y="55" font-size="12" fill="%23374151"%3EStation%3C/text%3E%3Cline x1="120" y1="50" x2="180" y2="50" stroke="%23059669" stroke-width="3"/%3E%3Ctext x="190" y="55" font-size="12" fill="%23374151"%3ERailway Line%3C/text%3E%3Ctext x="300" y="55" font-size="12" fill="%236b7280"%3ETime shown in minutes between stations%3C/text%3E%3C/svg%3E';

const ErrorText = styled.p`
  margin: 12px 0 0 0;
  font-size: 13px;
  color: #dc2626;
  font-family: inherit;
`;

const filtersRowStyle = { width: '100%', maxWidth: '360px' };
const actionsRowStyle = { display: 'flex', gap: '12px', marginTop: '20px' };
const actionButtonStyle = { flex: 'none', width: 'auto', padding: '10px 20px' };
const defaultPageTitle = 'Railway Network Schematic Diagrams';
const defaultPageSubtitle = 'View and compare route options across different network corridors. Each schematic shows station locations and journey times for the proposed railway programme.';
const defaultCaveatSections = [
  '<strong>Note:</strong> These schematics are indicative and subject to further design development. Journey times shown are approximate and may vary based on final design specifications and operational requirements. All routes are currently under consideration as part of the feasibility study.',
];

export function SVGGalleryManager({ config = {} }) {
  const filters = config?.filters || [];
  const pageTitle = config?.pageTitle || defaultPageTitle;
  const pageSubtitle = config?.pageSubtitle || defaultPageSubtitle;
  const configuredCaveats = Array.isArray(config?.caveats) ? config.caveats : [];
  const configuredLegends = Array.isArray(config?.legends) ? config.legends : [];
  const legendsFromArray = configuredLegends
    .map((legend, index) => {
      const src = normaliseAssetPath(legend?.path);
      if (!src) return null;
      return {
        id: `legend-${index}`,
        name: `${legend?.name || `Legend ${index + 1}`}`,
        filter: legend?.filter,
        match: legend?.match,
        src,
      };
    })
    .filter(Boolean);
  const caveatSections =
    Array.isArray(config?.caveatSections) && config.caveatSections.length > 0
      ? config.caveatSections
      : defaultCaveatSections;

  const [metadataTables, setMetadataTables] = useState({});
  const [schematics, setSchematics] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initialSelected = {};
    filters.forEach((filter) => {
      initialSelected[filter.paramName] = '';
    });
    setSelectedValues(initialSelected);
  }, [filters]);

  useEffect(() => {
    let cancelled = false;

    const loadMetadataTables = async () => {
      if (!Array.isArray(config?.metadataTables) || config.metadataTables.length === 0) {
        setMetadataTables({});
        return;
      }

      setLoadingMetadata(true);
      setErrorMessage('');
      try {
        const loaded = {};
        for (const table of config.metadataTables) {
          const response = await api.baseService.get(table.path);
          loaded[table.name] = applyWhereConditions(normaliseRows(response), table.where);
        }
        if (!cancelled) {
          setMetadataTables(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          setMetadataTables({});
          setErrorMessage('Failed to load filter metadata.');
        }
      } finally {
        if (!cancelled) {
          setLoadingMetadata(false);
        }
      }
    };

    loadMetadataTables();
    return () => {
      cancelled = true;
    };
  }, [config]);

  const filterOptions = useMemo(() => {
    const optionsByFilter = {};

    filters.forEach((filter, filterIndex) => {
      if (filter?.values?.source !== 'metadataTable') {
        optionsByFilter[filter.paramName] = [];
        return;
      }

      const tableName = filter.values.metadataTableName;
      let rows = metadataTables[tableName] || [];
      rows = applyWhereConditions(rows, filter.values.where);

      filters.forEach((otherFilter, otherIndex) => {
        if (otherIndex === filterIndex) return;
        if (otherFilter?.values?.source !== 'metadataTable') return;
        if (otherFilter.values.metadataTableName !== tableName) return;

        const selected = selectedValues[otherFilter.paramName];
        if (selected === null || selected === undefined || selected === '') return;

        const shouldConstrain = otherFilter.shouldFilterOthers || filter.shouldBeFiltered;
        if (!shouldConstrain) return;

        const sourceColumn = otherFilter.values.paramColumn;
        rows = rows.filter((row) => {
          const rowValue = row[sourceColumn];
          if (Array.isArray(selected)) {
            return selected.map((entry) => `${entry ?? ''}`).includes(`${rowValue ?? ''}`);
          }
          return `${rowValue ?? ''}` === `${selected ?? ''}`;
        });
      });

      const dedupe = new Map();
      rows.forEach((row) => {
        const displayValue = row?.[filter.values.displayColumn];
        const paramValue = row?.[filter.values.paramColumn];
        if (paramValue === null || paramValue === undefined || paramValue === '') return;
        const key = `${displayValue}__${paramValue}`;
        if (!dedupe.has(key)) {
          dedupe.set(key, { displayValue, paramValue });
        }
      });

      optionsByFilter[filter.paramName] = sortOptions(Array.from(dedupe.values()), filter.values.sort);
    });

    return optionsByFilter;
  }, [filters, metadataTables, selectedValues]);

  const activeCaveatSections = useMemo(() => {
    if (schematics.length === 0) {
      return [];
    }

    if (configuredCaveats.length === 0) {
      return caveatSections;
    }

    const seen = new Set();
    const resolved = [];
    configuredCaveats.forEach((caveat) => {
      const caveatText = caveat?.text;
      if (!caveatText || seen.has(caveatText)) return;

      if (!caveat?.filter) {
        seen.add(caveatText);
        resolved.push({
          name: caveat?.name || '',
          text: caveatText,
        });
        return;
      }

      const matchesAnySchematic = schematics.some((schematic) => {
        const selectedLabel = schematic?.selectedFilterLabels?.[caveat.filter];
        return ruleMatchesSelectedValue(caveat, selectedLabel);
      });

      if (!matchesAnySchematic) return;
      seen.add(caveatText);
      resolved.push({
        name: caveat?.name || '',
        text: caveatText,
      });
    });

    return resolved;
  }, [configuredCaveats, schematics, caveatSections]);

  const activeLegends = useMemo(() => {
    if (schematics.length === 0) {
      return [];
    }

    if (legendsFromArray.length === 0) {
      return [
        {
          id: 'default-legend',
          name: 'Diagram legend',
          src: legendSvg,
        },
      ];
    }

    return legendsFromArray.filter((legend) => {
      if (!legend?.filter) return true;

      return schematics.some((schematic) => {
        const selectedLabel = schematic?.selectedFilterLabels?.[legend.filter];
        return ruleMatchesSelectedValue(legend, selectedLabel);
      });
    });
  }, [legendsFromArray, schematics]);

  const allRequiredFiltersSelected = filters.every((filter) => {
    const value = selectedValues[filter.paramName];
    return value !== null && value !== undefined && value !== '';
  });

  const handleFilterChange = (changedFilter, value) => {
    setErrorMessage('');
    setSelectedValues((previous) => {
      const next = { ...previous, [changedFilter.paramName]: value };
      const changedIndex = filters.findIndex((filter) => filter.paramName === changedFilter.paramName);

      filters.forEach((filter, index) => {
        if (index <= changedIndex) return;
        if (filter.shouldBeFiltered) {
          next[filter.paramName] = '';
        }
      });

      return next;
    });
  };

  const handleAddSchematic = async () => {
    if (!allRequiredFiltersSelected || !config?.apiQuery) return;

    setIsAdding(true);
    setErrorMessage('');
    try {
      const queryParams = {};
      const selectedFilterLabels = {};
      filters.forEach((filter) => {
        const value = selectedValues[filter.paramName];
        if (value !== null && value !== undefined && value !== '') {
          queryParams[filter.paramName] = value;

          const option = (filterOptions[filter.paramName] || []).find(
            (entry) => `${entry.paramValue}` === `${value}`
          );
          selectedFilterLabels[filter.filterName] = option?.displayValue || value;
        }
      });

      const path = buildPathWithQuery(config.apiQuery, queryParams);
      const response = await api.baseService.get(path);
      let rows = normaliseRows(response);

      // Filter rows to match selected filter values
      rows = rows.filter((row) => {
        return filters.every((filter) => {
          const selectedValue = selectedValues[filter.paramName];
          const paramColumn = filter.values?.paramColumn;
          
          if (!selectedValue || !paramColumn) return true; // Skip if not configured
          
          const rowValue = row?.[paramColumn];
          // Convert both to strings for comparison
          const rowValueStr = `${rowValue ?? ''}`.trim();
          const selectedValueStr = `${selectedValue}`.trim();
          
          return rowValueStr === selectedValueStr;
        });
      });

      const newCards = rows
        .map((row, index) => {
          const svgUrl = resolveSvgUrl(row);
          if (!svgUrl) return null;

          const primaryFilter = filters[0];
          const secondaryFilter = filters[1];

          return {
            id: `${Date.now()}-${index}`,
            network: row?.network || row?.network_name || row?.[primaryFilter?.values?.displayColumn] || 'Network schematic',
            corridor: row?.view || row?.corridor || row?.[secondaryFilter?.values?.displayColumn] || 'Selection',
            url: svgUrl,
            selectedFilterLabels: filters.reduce((accumulator, filter) => {
              const displayColumn = filter?.values?.displayColumn;
              const rowDisplayValue = displayColumn ? row?.[displayColumn] : null;
              if (rowDisplayValue !== null && rowDisplayValue !== undefined && rowDisplayValue !== '') {
                accumulator[filter.filterName] = rowDisplayValue;
                return accumulator;
              }

              const selectedLabel = selectedFilterLabels[filter.filterName];
              if (selectedLabel !== null && selectedLabel !== undefined && selectedLabel !== '') {
                accumulator[filter.filterName] = selectedLabel;
              }
              return accumulator;
            }, {}),
          };
        })
        .filter(Boolean);

      if (newCards.length === 0) {
        setErrorMessage('No SVGs were returned for this selection.');
        return;
      }

      setSchematics((previous) => [...previous, ...newCards]);
    } catch (error) {
      setErrorMessage('Failed to fetch network schematic SVG.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = (id) => {
    setSchematics(schematics.filter(s => s.id !== id));
  };

  const handleInlineCancel = () => {
    const reset = {};
    filters.forEach((filter) => {
      reset[filter.paramName] = '';
    });
    setSelectedValues(reset);
    setErrorMessage('');
  };

  return (
    <Container>
      <Header>
        <Title>{pageTitle}</Title>
        <Subtitle>{pageSubtitle}</Subtitle>
      </Header>

      {activeCaveatSections.length > 0 && (
        <CaveatsContainer>
          {activeCaveatSections.map((caveat, index) => (
            <CaveatSection key={`caveat-${index}`}>
              {caveat?.name && <CaveatTitle>{caveat.name}</CaveatTitle>}
              {typeof caveat.text === 'string' ? (
                <CaveatText dangerouslySetInnerHTML={{ __html: caveat.text }} />
              ) : (
                <CaveatText>{`${caveat.text ?? ''}`}</CaveatText>
              )}
            </CaveatSection>
          ))}
        </CaveatsContainer>
      )}

      {activeLegends.length > 0 && (
        <LegendSection>
          <LegendsRow>
            {activeLegends.map((legend) => (
              <LegendItem key={legend.id}>
                <LegendItemTitle>{legend.name}</LegendItemTitle>
                <LegendWrapper>
                  <LegendImage src={legend.src} alt={legend.name} />
                </LegendWrapper>
              </LegendItem>
            ))}
          </LegendsRow>
        </LegendSection>
      )}

      <SchematicsGrid>
        {schematics.map(schematic => (
          <Card key={schematic.id}>
            <CardTitle>
              <CardTitleText>{schematic.network}</CardTitleText>
              <CardSubtitle>{schematic.corridor}</CardSubtitle>
            </CardTitle>
            <ImageWrapper>
              <img src={schematic.url} alt={`${schematic.network} - ${schematic.corridor}`} />
            </ImageWrapper>
            <CardActions>
              <RemoveButton onClick={() => handleRemove(schematic.id)}>
                Remove
              </RemoveButton>
            </CardActions>
          </Card>
        ))}

        <PlaceholderCard>
          <PlaceholderText style={{ marginBottom: '24px', fontSize: '18px' }}>
            Add Card
          </PlaceholderText>

          {filters.map((filter) => {
            const options = filterOptions[filter.paramName] || [];
            const selectedValue = selectedValues[filter.paramName] ?? '';

            return (
              <FormGroup key={filter.paramName} style={filtersRowStyle}>
                <Label>{filter.filterName}</Label>
                <Select
                  value={selectedValue}
                  onChange={(event) => handleFilterChange(filter, event.target.value)}
                  disabled={loadingMetadata || options.length === 0}
                >
                  <option value="">Select {filter.filterName.toLowerCase()}...</option>
                  {options.map((option) => (
                    <option key={`${filter.paramName}-${option.paramValue}`} value={option.paramValue}>
                      {option.displayValue}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            );
          })}

          <div style={actionsRowStyle}>
            <SecondaryButton
              onClick={handleInlineCancel}
              style={actionButtonStyle}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleAddSchematic}
              disabled={!allRequiredFiltersSelected || isAdding || loadingMetadata}
              style={actionButtonStyle}
            >
              {isAdding ? 'Adding...' : 'Add'}
            </PrimaryButton>
          </div>

          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </PlaceholderCard>
      </SchematicsGrid>
    </Container>
  );
}