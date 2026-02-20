import React, { useMemo, useRef, useState, useEffect } from 'react';
import Select from 'react-select';
import styled, { useTheme } from 'styled-components';
import { useFetchVisualisationData } from 'hooks';
import { useMetadataDrivenFilters } from 'hooks/useMetadataDrivenFilters';
import {
  normaliseAssetPath,
  normaliseRows,
  ruleMatchesSelectedValue,
  resolveSvgUrl,
} from 'utils';
import { makeSelectStyles } from 'utils/selectStyles';
import { AppButton } from '../AppButton';

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
  width: 100%;
  text-align: left;
`;

const CaveatText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #5f4e00;
  line-height: 1.4;
  font-family: inherit;
  text-align: left;
`;

const CaveatTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #5f4e00;
  font-family: inherit;
  text-align: left;
`;

const CaveatsContainer = styled.div`
  display: block;
  margin-bottom: 24px;
`;

const CaveatItem = styled.div`
  & + & {
    margin-top: 12px;
  }
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
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio || '3 / 2'};
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
  
  img, svg {
    width: 100%;
    height: 100%;
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


const ErrorText = styled.p`
  margin: 12px 0 0 0;
  font-size: 13px;
  color: #dc2626;
  font-family: inherit;
`;

const filtersRowStyle = { width: '100%', maxWidth: '360px' };
const actionsRowStyle = { display: 'flex', gap: '12px', marginTop: '20px' };

/**
 * Renders a configuration-driven gallery of SVG schematics.
 *
 * Behaviour summary:
 * - Loads metadata tables (if configured) to populate cascading dropdown filters.
 * - Fetches schematics from the configured API when the user adds a card.
 * - Shows conditional caveats and legends based on current schematic selections.
 *
 * @param {object} props
 * @param {object} [props.config] - Page-level configuration used by the gallery.
 * @returns {JSX.Element}
 */
export function SVGGalleryManager({ config = {} }) {
  const theme = useTheme();
  const selectStyles = useMemo(() => makeSelectStyles(theme), [theme]);

  const {
    filters: metadataDrivenFilters,
    filterState,
    onFilterChange,
    isReady: areMetadataFiltersReady,
  } = useMetadataDrivenFilters();

  const filters = Array.isArray(metadataDrivenFilters) ? metadataDrivenFilters : [];
  const pageTitle = typeof config?.pageTitle === 'string' ? config.pageTitle : '';
  const pageSubtitle = typeof config?.pageSubtitle === 'string' ? config.pageSubtitle : '';
  const valueField = config?.valueField;
  const requiresAuth = config?.requiresAuth ?? true;

  /**
   * Optional card sizing rules.
   *
   * `defaultCardRatio` is used when no matching rule is found.
   * `cardRatios` reuses the same rule structure as legends/caveats:
   * - `filter`: key in `schematic.selectedFilterLabels` to match against
   * - `match`: rule string (e.g. `=== Full Network`, `!= Full Network`)
   * - `ratio`: CSS aspect-ratio value (e.g. `3 / 1`, `3 / 2`)
   */
  const cardRatios = Array.isArray(config?.cardRatios) ? config.cardRatios : [];
  const defaultCardRatio = typeof config?.defaultCardRatio === 'string' && config.defaultCardRatio.trim() !== ''
    ? config.defaultCardRatio.trim()
    : '3 / 2';
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
  const caveatSections = Array.isArray(config?.caveatSections) ? config.caveatSections : [];

  const [schematics, setSchematics] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const loadingMetadata = !areMetadataFiltersReady;

  const [svgFetchNonce, setSvgFetchNonce] = useState(0);
  const [svgRequest, setSvgRequest] = useState(null);
  const processedSvgNonceRef = useRef(0);
  const lastSvgDataRef = useRef(null);


  /**
   * Memo: Resolve which caveats should be shown for the current set of schematics.
   */
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

  /**
   * Memo: Resolve which legends should be shown for the current set of schematics.
   */
  const activeLegends = useMemo(() => {
    if (schematics.length === 0) {
      return [];
    }

    if (legendsFromArray.length === 0) return [];

    return legendsFromArray.filter((legend) => {
      if (!legend?.filter) return true;

      return schematics.some((schematic) => {
        const selectedLabel = schematic?.selectedFilterLabels?.[legend.filter];
        return ruleMatchesSelectedValue(legend, selectedLabel);
      });
    });
  }, [legendsFromArray, schematics]);

  const allRequiredFiltersSelected = filters.every((filter) => {
    const value = filterState?.[filter.id];
    return value !== null && value !== undefined && value !== '';
  });

  const svgVisualisation = useMemo(() => {
    if (!config?.apiQuery) return null;
    if (!svgRequest?.queryParams) return null;
    return {
      name: `SVGGalleryManager:svg:${svgFetchNonce}`,
      dataPath: config.apiQuery,
      queryParams: svgRequest.queryParams,
      pathParams: {},
      requiresAuth,
    };
  }, [config?.apiQuery, requiresAuth, svgFetchNonce, svgRequest]);

  const {
    isLoading: isAdding,
    data: svgData,
    error: svgError,
  } = useFetchVisualisationData(svgVisualisation);

  /**
   * Update the selected filter value via FilterContext.
   * If a later filter depends on an earlier filter, reset it when the earlier value changes.
   *
   * @param {object} changedFilter - Filter definition from config (must include `.id`).
   * @param {string|null} value - Newly selected value.
   */
  const handleFilterChange = (changedFilter, value) => {
    setErrorMessage('');
    onFilterChange(changedFilter, value === '' ? null : value);

    const changedIndex = filters.findIndex((filter) => filter.id === changedFilter.id);
    if (changedIndex === -1) return;

    filters.forEach((filter, index) => {
      if (index <= changedIndex) return;
      if (!filter.shouldBeFiltered) return;
      onFilterChange(filter, null);
    });
  };

  /**
   * Fetch schematics for the current filter selection and append them as cards.
   * Handles APIs that return either an array of rows or a single row object.
   *
   * @returns {Promise<void>}
   */
  const handleAddSchematic = () => {
    if (!allRequiredFiltersSelected || !config?.apiQuery) return;

    setErrorMessage('');

    const queryParams = {};
    const selectedFilterLabels = {};
    filters.forEach((filter) => {
      const value = filterState?.[filter.id];
      const valueForHook = value === '' ? null : value;
      queryParams[filter.paramName] = { value: valueForHook, required: true };

      if (valueForHook !== null && valueForHook !== undefined) {
        const option = (filter?.values?.values || [])
          .filter((entry) => !entry?.isHidden)
          .find((entry) => `${entry?.paramValue}` === `${valueForHook}`);
        const labelKey = filter.filterName || filter.paramName;
        selectedFilterLabels[labelKey] = option?.displayValue || `${valueForHook}`;
      }
    });

    setSvgRequest({ queryParams, selectedFilterLabels });
    setSvgFetchNonce((previous) => previous + 1);
  };

  /**
   * Effect: When SVG data arrives from useFetchVisualisationData, append new cards.
   */
  useEffect(() => {
    if (!svgRequest) return;
    if (svgFetchNonce === 0) return;
    if (isAdding) return;

    if (svgError) {
      setErrorMessage('Failed to fetch SVG.');
      return;
    }

    if (svgData === null || svgData === undefined) return;
    if (svgData === lastSvgDataRef.current) return;
    if (processedSvgNonceRef.current === svgFetchNonce) return;

    lastSvgDataRef.current = svgData;
    processedSvgNonceRef.current = svgFetchNonce;

    let rows = normaliseRows(svgData);
    if (rows.length === 0 && svgData && typeof svgData === 'object' && !Array.isArray(svgData)) {
      rows = [svgData];
    }

    // If the API returns filter columns, constrain rows to the requested selection.
    // If it only returns { id, value } (or similar), skip this constraint.
    rows = rows.filter((row) => {
      return filters.every((filter) => {
        const requestedValue = svgRequest?.queryParams?.[filter.paramName]?.value;
        const paramColumn = filter.values?.paramColumn;

        if (requestedValue === null || requestedValue === undefined || requestedValue === '') return true;
        if (!paramColumn) return true;
        if (!row || typeof row !== 'object') return false;
        if (!(paramColumn in row)) return true;

        const rowValue = row[paramColumn];
        return `${rowValue ?? ''}`.trim() === `${requestedValue ?? ''}`.trim();
      });
    });

    const newCards = rows
      .map((row, index) => {
        const svgUrl = resolveSvgUrl(row, { valueField });
        if (!svgUrl) return null;

        const selectedLabelParts = filters
          .map((filter) => svgRequest.selectedFilterLabels[filter.filterName || filter.paramName])
          .filter((entry) => entry !== null && entry !== undefined && `${entry}`.trim() !== '')
          .map((entry) => `${entry}`.trim());

        const title = selectedLabelParts[0] || '';
        const subtitle = selectedLabelParts.length > 1 ? selectedLabelParts.slice(1).join(' • ') : '';

        return {
          id: `${Date.now()}-${index}`,
          title,
          subtitle,
          url: svgUrl,
          selectedFilterLabels: filters.reduce((accumulator, filter) => {
            const displayColumn = filter?.values?.displayColumn;
            const rowDisplayValue = displayColumn ? row?.[displayColumn] : null;
            if (rowDisplayValue !== null && rowDisplayValue !== undefined && rowDisplayValue !== '') {
              const labelKey = filter.filterName || filter.paramName;
              accumulator[labelKey] = rowDisplayValue;
              return accumulator;
            }

            const selectedLabel = svgRequest.selectedFilterLabels[filter.filterName || filter.paramName];
            if (selectedLabel !== null && selectedLabel !== undefined && selectedLabel !== '') {
              const labelKey = filter.filterName || filter.paramName;
              accumulator[labelKey] = selectedLabel;
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
  }, [
    filters,
    isAdding,
    svgData,
    svgError,
    svgFetchNonce,
    svgRequest,
    valueField,
  ]);

  /**
   * Remove a card from the current gallery.
   * @param {string} id - Card id.
   */
  const handleRemove = (id) => {
    setSchematics(schematics.filter(s => s.id !== id));
  };

  /**
   * Clear current selections and any inline error message.
   */
  const handleInlineCancel = () => {
    filters.forEach((filter) => {
      onFilterChange(filter, null);
    });
    setErrorMessage('');
  };

  /**
   * Resolve the CSS aspect-ratio for a schematic card.
   *
   * If `config.cardRatios` is provided, the first matching rule wins.
   * Otherwise (or when nothing matches), falls back to `config.defaultCardRatio`.
   *
   * @param {object} schematic - The schematic/card model held in component state.
   * @returns {string} - A CSS aspect-ratio string, e.g. `3 / 2`.
   */

  const getSchematicAspectRatio = (schematic) => {
    if (!schematic) return defaultCardRatio;
    if (cardRatios.length === 0) return defaultCardRatio;

    for (const rule of cardRatios) {
      const ratio = typeof rule?.ratio === 'string' ? rule.ratio.trim() : '';
      const filterKey = rule?.filter;
      if (!ratio) continue;
      if (typeof filterKey !== 'string' || filterKey.trim() === '') continue;
      if (typeof rule?.match !== 'string' || rule.match.trim() === '') continue;

      const selectedLabel = schematic?.selectedFilterLabels?.[filterKey];
      if (ruleMatchesSelectedValue(rule, selectedLabel)) {
        return ratio;
      }
    }

    return defaultCardRatio;
  };

  return (
    <Container>
      {(pageTitle || pageSubtitle) && (
        <Header>
          {pageTitle && <Title>{pageTitle}</Title>}
          {pageSubtitle && <Subtitle>{pageSubtitle}</Subtitle>}
        </Header>
      )}

      {activeCaveatSections.length > 0 && (
        <CaveatsContainer>
          <CaveatSection>
            {activeCaveatSections.map((caveat, index) => (
              <CaveatItem key={`caveat-${index}`}>
                {caveat?.name && <CaveatTitle>{caveat.name}</CaveatTitle>}
                {typeof caveat.text === 'string' ? (
                  <CaveatText dangerouslySetInnerHTML={{ __html: caveat.text }} />
                ) : (
                  <CaveatText>{`${caveat.text ?? ''}`}</CaveatText>
                )}
              </CaveatItem>
            ))}
          </CaveatSection>
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
              <CardTitleText>{schematic.title}</CardTitleText>
              {schematic.subtitle && <CardSubtitle>{schematic.subtitle}</CardSubtitle>}
            </CardTitle>
            <ImageWrapper $aspectRatio={getSchematicAspectRatio(schematic)}>
              <img
                src={schematic.url}
                alt={`${schematic.title}${schematic.subtitle ? ` - ${schematic.subtitle}` : ''}`}
              />
            </ImageWrapper>
            <CardActions>
              <AppButton
                $bgColor="#d32f2f"
                $height="30px"
                onClick={() => handleRemove(schematic.id)}
              >
                Remove
              </AppButton>
            </CardActions>
          </Card>
        ))}

        <PlaceholderCard>
          <PlaceholderText style={{ marginBottom: '24px', fontSize: '18px' }}>
            Add Card
          </PlaceholderText>

          {filters.map((filter) => {
            const baseOptions = Array.isArray(filter?.values?.values)
              ? filter.values.values
              : [];
            const visibleOptions = baseOptions.filter((option) => !option?.isHidden);
            const reactSelectOptions = visibleOptions.map((option) => ({
              value: option.paramValue,
              label: option.displayValue,
            }));

            const selectedValue = filterState?.[filter.id] ?? null;
            const selectedOption = reactSelectOptions.find(
              (option) => `${option.value}` === `${selectedValue}`
            ) ?? null;

            return (
              <FormGroup key={filter.paramName} style={filtersRowStyle}>
                <Label>{filter.filterName}</Label>
                <Select
                  options={reactSelectOptions}
                  value={selectedOption}
                  onChange={(option) => handleFilterChange(filter, option?.value ?? null)}
                  styles={selectStyles}
                  menuPlacement="auto"
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                  isDisabled={loadingMetadata || reactSelectOptions.length === 0}
                  isLoading={loadingMetadata}
                  isClearable
                  placeholder={`Select ${filter.filterName.toLowerCase()}...`}
                />
              </FormGroup>
            );
          })}

          <div style={actionsRowStyle}>
            <AppButton
              $bgColor={theme?.navText ?? theme?.activeBg ?? "#7317de"}
              $height="36px"
              onClick={handleInlineCancel}
            >
              Cancel
            </AppButton>
            <AppButton
              $height="36px"
              onClick={handleAddSchematic}
              disabled={!allRequiredFiltersSelected || isAdding || loadingMetadata}
            >
              {isAdding ? 'Adding...' : 'Add'}
            </AppButton>
          </div>

          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </PlaceholderCard>
      </SchematicsGrid>
    </Container>
  );
}
