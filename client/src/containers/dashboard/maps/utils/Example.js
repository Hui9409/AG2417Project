/*
 * Copyright 2019 Teralytics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Flow, FlowAccessors, FlowLayerPickingInfo, Location, LocationAccessors } from '@flowmap.gl/core';
import FlowMap, { getViewStateForLocations, Highlight, LegendBox, LocationTotalsLegend } from '@flowmap.gl/react';
import React, { useState } from 'react';
import { ViewState } from '@flowmap.gl/core';
import { MAPBOX_ACCESS_TOKEN } from '../../../../config';
import { SliderPresentation } from '../../../../components/dashboard/slider';
import { useSelector, useDispatch } from 'react-redux';
import { setFlowMax, setLocMax } from '../../../../actions/mapAction';

const SHOW_TOP_FLOWS = 10000;


const tooltipStyle = {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 1,
  background: '#125',
  color: '#fff',
  fontSize: 9,
  borderRadius: 4,
  padding: 5,
  maxWidth: 300,
  maxHeight: 300,
  overflow: 'hidden',
  boxShadow: '2px 2px 4px #ccc',
};

export default function Example(props) {
  const { locations, flows, getLocationCentroid, onViewStateChange, getLocationId, getFlowMagnitude  } = props;
  const [tooltip, setTooltip] = useState();
  const initialViewState = getViewStateForLocations(locations, getLocationCentroid, [
    window.innerWidth,
    window.innerHeight,
  ]);

  const { flowMax, locMax } = useSelector(state => state.mapStyle);
  const dispatch = useDispatch();
  const flowMagnitudeExtent = [0, Math.round(20000/flowMax)];
  const locationTotalsExtent = [0, Math.round(200000/locMax)];

  const handleViewStateChange = (viewState) => {
    if (onViewStateChange) {
      onViewStateChange(viewState);
    }
    if (tooltip) {
      setTooltip(undefined);
    }
  }

  const handleHighlight = (highlight, info) => {
    if (!info) {
      setTooltip(undefined);
    }
    setTooltip(info);
  };

  const renderTooltip = () => {
    if (!tooltip) {
      return null;
    }
    const { object, x, y } = tooltip;
    if (!object) {
      return null;
    }
    return (
      <pre
        style={{
          ...tooltipStyle,
          left: x,
          top: y,
        }}
      >
        {JSON.stringify(object, null, 2)}
      </pre>
    );
  }

  return (
    <>
      <FlowMap
        pickable={true}
        initialViewState={initialViewState}
        flowMagnitudeExtent={flowMagnitudeExtent}
        locationTotalsExtent={locationTotalsExtent}
        showTotals={true}
        showLocationAreas={false}
        showOnlyTopFlows={SHOW_TOP_FLOWS}
        flows={flows}
        locations={locations}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        getLocationId={getLocationId}
        getLocationCentroid={getLocationCentroid}
        getFlowMagnitude={getFlowMagnitude}
        onViewStateChange={handleViewStateChange}
        onHighlighted={handleHighlight}
      />
      <LegendBox bottom={35} left={10}>
        <LocationTotalsLegend />
      </LegendBox>
      <LegendBox bottom={35} right={10}>
        {`Showing ${flows.length > SHOW_TOP_FLOWS ? `top ${SHOW_TOP_FLOWS} of` : ''} ${flows.length} flows. `}
      </LegendBox>
      {renderTooltip()}
    </>
  );
}