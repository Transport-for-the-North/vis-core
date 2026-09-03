import React, { useState, useEffect } from "react";
import { Warning } from "Components/WarningMessage/Warning";
import { api } from "services";

/**
 * Higher-Order Component that adds a warning message to the wrapped component.
 * It can handle both static and dynamic warnings.
 * @param {React.ComponentType} WrappedComponent - The component to wrap.
 * @returns {React.ComponentType} The wrapped component with a warning message if applicable.
 */
export const withWarning = (WrappedComponent) => {
  return (props) => {
    const { pageConfig } = props;
    const [isVisible, setIsVisible] = useState(true);
    const [dynamicMessage, setDynamicMessage] = useState(null);

    const [isMobile, setIsMobile] = useState(() =>
      typeof window !== 'undefined'
        ? window.matchMedia('(max-width: 900px)').matches
        : false
    );
    const [dynamicMessageMobile, setDynamicMessageMobile] = useState(null);

    const handleClose = () => {
      setIsVisible(false);
    };

    useEffect(() => {
      if (isMobile) return; 
      const fetchData = async () => {
        const dynamicWarningConfig = pageConfig.config?.additionalFeatures?.dynamicWarning;
        if (dynamicWarningConfig && dynamicWarningConfig.url && dynamicWarningConfig.template) {
          const controller = new AbortController();
          try {
            const response = await api.baseService.get(dynamicWarningConfig.url, { signal: controller.signal });
            console.log("Response Body:", response);
            const data = response.data;
            const message = response.message;
            let dynamicMessage = dynamicWarningConfig.template.replace(/{(\w+)}/g, (_, key) => data || '');
            if (message) {
              dynamicMessage += 
                '\n</span><span class="si">${</span><span class="nx">message</span><span class="si">}</span><span class="sb">';
            }
            setDynamicMessage(dynamicMessage);
          } catch (error) {
            if (error.name !== "AbortError") {
              console.error("Error fetching dynamic warning data:", error);
            }
          }
          return () => {
            controller.abort();
          };
        }
      };
      fetchData();
    }, [pageConfig]);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const mql = window.matchMedia('(max-width: 900px)');
      const onChange = (e) => setIsMobile(e.matches);

      setIsMobile(mql.matches);

      if (mql.addEventListener) mql.addEventListener('change', onChange);
      else mql.addListener(onChange); // Safari

      return () => {
        if (mql.removeEventListener) mql.removeEventListener('change', onChange);
        else mql.removeListener(onChange);
      };
    }, []);

    useEffect(() => {
      // only attempt mobile-specific fetch on mobile
      if (!isMobile) return;

      const cfg = pageConfig?.config?.additionalFeatures?.dynamicWarningMobile;
      if (!(cfg && cfg.url && cfg.template)) return;

      const controller = new AbortController();

      (async () => {
        try {
          const response = await api.baseService.get(cfg.url, { signal: controller.signal });
          const payload = response?.data ?? response;
          // simple {key} replacement from payload
          const msg = cfg.template.replace(/{(\w+)}/g, (_, key) =>
            payload && payload[key] != null ? String(payload[key]) : ''
          );
          setDynamicMessageMobile(msg);
        } catch (error) {
          if (error.name !== 'AbortError') console.error('Error fetching mobile dynamic warning:', error);
        }
      })();

      return () => controller.abort();
    }, [pageConfig, isMobile]);


    const staticWarning = pageConfig?.config?.additionalFeatures?.warning;
    const staticWarningMobile = pageConfig?.config?.additionalFeatures?.mobileWarning; // optional

    const warningMessage = isMobile
      ? (dynamicMessageMobile || staticWarningMobile || staticWarning)
      : (dynamicMessage || staticWarning);
      
    return (
      <>
        {warningMessage && isVisible && (
          <Warning message={warningMessage} onClose={handleClose} />
        )}
        <WrappedComponent {...props} />
      </>
    );
  };
};