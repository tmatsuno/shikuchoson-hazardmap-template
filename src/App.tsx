import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet/dist/leaflet.css";
import { Helmet } from "react-helmet";
import {
  AttributionControl,
  GeoJSON,
  LayersControl,
  MapContainer,
  ScaleControl,
  TileLayer,
} from "react-leaflet";
import { BottomLeftImages } from "./components/BottomLeftImages";
import { OverlayFeatureLayers } from "./components/OverlayFeatureLayers";
import csvFeatureCollections from "./generated/csv-feature-collections.json";
import config from "./generated/hazardmap-config.json";
import imageNames from "./generated/image-names.json";
import shikuchosonBoundary from "./generated/shikuchoson-boundary.json";

const breakpoint = 768;

function App() {
  const bounds: [number, number][] = [
    [shikuchosonBoundary.bbox[1], shikuchosonBoundary.bbox[0]],
    [shikuchosonBoundary.bbox[3], shikuchosonBoundary.bbox[2]],
  ];

  return (
    <>
      <Helmet>
        <title>{config.shikuchoson}ハザードマップ</title>
      </Helmet>

      <MapContainer
        bounds={bounds}
        maxBounds={bounds}
        minZoom={5}
        maxZoom={17}
        attributionControl={false}
        style={{ height: "100vh" }}
      >
        <AttributionControl prefix={false} />

        <ScaleControl position="bottomright" />

        <TileLayer
          url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
          attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
        />

        <GeoJSON
          // @ts-ignore
          data={shikuchosonBoundary.geometry}
          style={{ fillOpacity: 0 }}
        />

        <LayersControl
          position="topright"
          collapsed={window.innerWidth <= breakpoint}
        >
          {config.tiles.map((tile) => (
            <LayersControl.Overlay
              key={tile.name}
              name={tile.name}
              checked={tile.checked}
            >
              <TileLayer
                url={tile.url}
                // @ts-ignore
                opacity={tile.opacity || 0.75}
                attribution={tile.attribution}
              />
            </LayersControl.Overlay>
          ))}

          <OverlayFeatureLayers
            // @ts-ignore
            featureCollections={csvFeatureCollections}
          />
        </LayersControl>

        <BottomLeftImages
          imageNames={imageNames}
          collapsed={window.innerWidth <= breakpoint}
        />
      </MapContainer>
    </>
  );
}

export default App;
