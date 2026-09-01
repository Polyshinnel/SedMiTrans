'use client';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

type MapComponents = {
  reactify: { useDefault: (value: unknown) => unknown };
  YMap: React.ComponentType<Record<string, unknown>>;
  YMapDefaultSchemeLayer: React.ComponentType;
  YMapDefaultFeaturesLayer: React.ComponentType;
  YMapMarker: React.ComponentType<Record<string, unknown>>;
};

type ReactifyApi = {
  useDefault: (value: unknown) => unknown;
  module: (api: YandexMapsApi) => Omit<MapComponents, 'reactify'>;
};

type YandexMapsApi = {
  ready: Promise<void>;
  import: (moduleName: string) => Promise<{ reactify: { bindTo: (react: typeof React, reactDom: typeof ReactDOM) => ReactifyApi } }>;
};

const apiKey = 'ddda0c18-95d3-493d-820b-a7304bc04e5c';
const coordinates: [number, number] = [32.0162, 54.77908];

async function loadMap(): Promise<MapComponents> {
  if (!document.querySelector('script[data-yandex-maps]')) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.dataset.yandexMaps = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Не удалось загрузить Яндекс Карты'));
      document.head.appendChild(script);
    });
  }

  const ymaps3 = (window as Window & { ymaps3?: YandexMapsApi }).ymaps3;
  if (!ymaps3) throw new Error('Яндекс Карты недоступны');
  await ymaps3.ready;
  const ymaps3React = await ymaps3.import('@yandex/ymaps3-reactify');
  const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);
  return { reactify, ...reactify.module(ymaps3) };
}

export function YandexMap() {
  const [components, setComponents] = React.useState<MapComponents | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    loadMap().then(setComponents).catch(() => setFailed(true));
  }, []);

  if (failed) {
    return <a className="mapFallback" href="https://yandex.ru/maps/?pt=32.0162,54.77908&z=16&l=map" target="_blank" rel="noreferrer">Открыть карту в Яндексе</a>;
  }
  if (!components) return <div className="mapLoading">Загружаем карту…</div>;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = components;
  return (
    <YMap location={{ center: coordinates, zoom: 16 }}>
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      <YMapMarker coordinates={coordinates}>
        <div aria-label="Офис SedMiTrans" style={{ transform: 'translate(-50%, -100%)', width: 42, height: 52 }}>
          <div style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', border: '4px solid white', borderRadius: '50% 50% 50% 0', background: '#ff7c1f', boxShadow: '0 4px 14px rgba(54, 39, 24, .38)', color: 'white', fontSize: 19, fontWeight: 800, transform: 'rotate(-45deg)' }}>
            <span style={{ transform: 'rotate(45deg)' }}>S</span>
          </div>
        </div>
      </YMapMarker>
    </YMap>
  );
}
