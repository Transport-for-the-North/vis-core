import React, { useMemo, useRef, useState, useEffect, useCallback, useContext } from 'react';
import Select from 'react-select';
import styled, { useTheme } from 'styled-components';
import { useFetchVisualisationData } from 'hooks';
import { useMetadataDrivenFilters } from 'hooks/useMetadataDrivenFilters';
import { AppContext } from 'contexts';
import { Footer } from 'Components/HomePage/Footer';
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
  min-height: calc(100vh - 75px); /* 75px = Navbar height; prevents overflow below viewport */
  background: #f8f9fa;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 1rem 3vw 1rem;
`;

const HeroBand = styled.section`
  background: #ffffff;
  border-bottom: 3px solid ${(p) => p.theme.activeBg || '#7317de'};
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.07);
  padding: 1.5rem 3vw 1.5rem;
`;

const HeroTop = styled.div`
  margin-bottom: 1.25rem;
`;

const Title = styled.h2`
  margin: 0 0 0.4rem;
  font-weight: 600;
  color: #0f172a;
  font-family: inherit;
  line-height: 1.15;
  text-align: left;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.4;
  max-width: 900px;
  text-align: left;
`;

const HeroDivider = styled.hr`
  margin: 1.25rem 0 1.25rem;
  border: none;
  border-top: 1px solid #e5e7eb;
`;

/* Two-column body: caveats left, legends right */
const HeroBody = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 860px) {
    grid-template-columns: 1fr 1fr;
  }
`;

/* Caveats — inline text, no card border */
const CaveatColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CaveatItem = styled.div`
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const CaveatTitle = styled.h3`
  margin: 0 0 3px;
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    flex-shrink: 0;
  }
`;

const CaveatText = styled.div`
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
  white-space: normal;
  text-align: left;
`;

/* Legends — sits in the right column of the hero body, no card border */
const LegendSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const LegendsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch; /* All items in the row grow to the same height */
  gap: 6px;
`;

const LegendItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 160px;
`;

const LegendItemTitle = styled.h3`
  margin: 0 0 5px;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  text-align: left;
`;

const LegendWrapper = styled.div`
  flex: 1; /* Grow to fill remaining column height so all wrappers match */
  width: 100%;
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const LegendImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 110px;
  object-fit: contain;
  object-position: left top;
`;

const SchematicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(800px, 1fr));
  grid-auto-rows: 1fr; /* All rows the same height */
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: ${(p) => p.theme.borderRadius || '8px'};
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const PlaceholderCard = styled(Card)`
  border: 2px dashed #cbd5e1;
  box-shadow: none;
  background: #f8fafc;
  align-items: center;
  justify-content: center;
  min-height: 360px;
  padding: 32px 24px;
`;

const PlaceholderText = styled.p`
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #475569;
`;

const CardTitle = styled.div`
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const CardTitleText = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  text-align: left;
`;

const CardSubtitle = styled.p`
  margin: 2px 0 0 0;
  font-size: 12px;
  color: #64748b;
  text-align: left;
`;

const ImageWrapper = styled.div`
  flex: 1; /* Fill remaining card height so all cards in a row share the same image area */
  min-height: 280px;
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio || '3 / 2'};
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;

  img, svg {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
`;

const CardActions = styled.div`
  padding: 10px 16px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
  width: 100%;
  max-width: 360px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #334155;
  font-size: 13px;
  text-align: left;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const ErrorText = styled.p`
  margin: 12px 0 0 0;
  font-size: 13px;
  font-weight: 500;
  color: #ef4444;
  text-align: left;
`;

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
  const appContext = useContext(AppContext);
  const footer = appContext?.footer;

  const {
    filters: metadataDrivenFilters,
    filterState,
    onFilterChange,
    isReady: areMetadataFiltersReady,
  } = useMetadataDrivenFilters();

  const filters = Array.isArray(metadataDrivenFilters) ? metadataDrivenFilters : [];
  const renderableFilters = useMemo(
    () => filters.filter((filter) => filter?.type !== 'fixed'),
    [filters]
  );
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
    const source = configuredCaveats.length > 0 ? configuredCaveats : caveatSections;
    if (!Array.isArray(source) || source.length === 0) return [];

    const seen = new Set();
    return source
      .map((caveat) => {
        const caveatText = caveat?.text;
        if (!caveatText) return null;
        if (seen.has(caveatText)) return null;
        seen.add(caveatText);
        return {
          name: caveat?.name || '',
          text: caveatText,
        };
      })
      .filter(Boolean);
  }, [configuredCaveats, caveatSections]);

  /**
   * Memo: Resolve which legends should be shown for the current set of schematics.
   */
  const activeLegends = useMemo(() => legendsFromArray, [legendsFromArray]);

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
   * Reset the dropdown selections back to an unselected state.
   * Useful after adding a card so the next card starts fresh.
   */
  const resetFilterSelections = useCallback(() => {
    // Fixed filters are intentionally hidden and must keep their (default) value.
    filters.forEach((filter) => {
      if (filter?.type === 'fixed') return;
      onFilterChange(filter, null);
    });
  }, [filters, onFilterChange]);

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
          .map((filter) => filter.type === 'fixed' ? null : svgRequest.selectedFilterLabels[filter.filterName || filter.paramName])
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
    resetFilterSelections();
  }, [
    filters,
    isAdding,
    resetFilterSelections,
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
    setSchematics(schematics.filter((s) => s.id !== id));
  };

  /**
   * Clear current selections and any inline error message.
   */
  const handleInlineCancel = () => {
    resetFilterSelections();
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
      {(pageTitle || pageSubtitle || activeCaveatSections.length > 0 || activeLegends.length > 0) && (
        <HeroBand>
          {(pageTitle || pageSubtitle) && (
            <HeroTop>
              {pageTitle && <Title>{pageTitle}</Title>}
              {pageSubtitle && <Subtitle>{pageSubtitle}</Subtitle>}
            </HeroTop>
          )}

          {(activeCaveatSections.length > 0 || activeLegends.length > 0) && (
            <>
              {(pageTitle || pageSubtitle) && <HeroDivider />}
              <HeroBody>
                {activeCaveatSections.length > 0 && (
                  <CaveatColumn>
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
                  </CaveatColumn>
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
              </HeroBody>
            </>
          )}
        </HeroBand>
      )}

      <ContentArea>
      <SchematicsGrid>
        {schematics.map((schematic) => (
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
          <PlaceholderText>Add Card</PlaceholderText>

          {renderableFilters.map((filter) => {
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
              <FormGroup key={filter.paramName}>
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

          <ActionsRow>
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
          </ActionsRow>

          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </PlaceholderCard>
      </SchematicsGrid>
      </ContentArea>
      {footer && <Footer {...footer} />}
    </Container>
  );
}
