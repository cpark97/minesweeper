import { memo } from 'react';

import './ResetButton.css';

function _NormalFace() {
  return (
    <svg viewBox="12 12 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="22" fill="#FCEA2B" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/>
      <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M45.8149,44.9293 c-2.8995,1.6362-6.2482,2.5699-9.8149,2.5699s-6.9153-0.9336-9.8149-2.5699"/>
      <path d="M30,31c0,1.6568-1.3448,3-3,3c-1.6553,0-3-1.3433-3-3c0-1.6552,1.3447-3,3-3C28.6552,28,30,29.3448,30,31"/>
      <path d="M48,31c0,1.6568-1.3447,3-3,3s-3-1.3433-3-3c0-1.6552,1.3447-3,3-3S48,29.3448,48,31"/>
    </svg>
  );
}
export const NormalFace = memo(_NormalFace);

function _FailedFace() {
  return (
    <svg id="emoji" viewBox="12 12 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="22" fill="#FCEA2B" stroke="#000000" strokeMiterlimit="10" strokeWidth="3"/>
      <path d="M25 48 Q36 36, 47 48" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <line x1="49" y1="25" x2="40" y2="34" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
      <line x1="40" y1="25" x2="49" y2="34" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
      <line x1="32" y1="25" x2="23" y2="34" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
      <line x1="23" y1="25" x2="32" y2="34" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
    </svg>
  );
}
export const FailedFace = memo(_FailedFace);

function _SucceededFace() {
  return (
    <svg viewBox="12 12 48 48" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle cx="36" cy="36" r="23" fill="#FCEA2B"/>
        <path fill="#3F3F3F" d="M45.331,38.5639c3.9628,0,7.1782-2.8618,7.1782-6.3889c0-1.7646,0.4473-3.5291-0.8519-4.6852 s-4.3449-1.7037-6.3264-1.7037c-2.3567,0-5.1428,0.1434-6.4514,1.7037c-0.8933,1.0652-0.7268,3.2534-0.7268,4.6852 C38.1528,35.7021,41.3655,38.5639,45.331,38.5639z"/>
        <path fill="#3F3F3F" d="M25.7384,38.5639c3.9628,0,7.1782-2.8618,7.1782-6.3889c0-1.7646,0.4473-3.5291-0.8519-4.6852 s-4.3449-1.7037-6.3264-1.7037c-2.3567,0-5.1428,0.1434-6.4514,1.7037c-0.8933,1.0652-0.7268,3.2534-0.7268,4.6852 C18.5602,35.7021,21.7729,38.5639,25.7384,38.5639z"/>
        <path fill="#9B9B9A" stroke="#9B9B9A" strokeMiterlimit="10" strokeWidth="2" d="M33.8155,35.6315"/>
      </g>
      <g>
        <circle cx="36" cy="36" r="22" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"/>
        <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M45.7019,44.862c-6.574,3.5248-14.0454,3.6576-19.6295,0"/>
        <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M18.8826,30.4638c0,0-0.953,8.5508,6.8608,7.9185c2.6197-0.212,7.8164-0.6507,7.867-8.3427 c0.0046-0.6979-0.0078-1.5989-0.8108-2.6298c-1.0647-1.3669-3.5716-1.9711-9.9446-1.422 C22.8551,25.9879,19.4088,25.8888,18.8826,30.4638z"/>
        <polyline fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" points="18.9534,29.9307 18.5203,26.5594 22.3532,26.0317"/>
        <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M52.7412,30.4638c0,0,0.953,8.5508-6.8608,7.9185c-2.6197-0.212-7.8164-0.6507-7.867-8.3427 c-0.0046-0.6979,0.0078-1.5989,0.8108-2.6298c1.0647-1.3669,3.5716-1.9711,9.9446-1.422 C48.7688,25.9879,52.2151,25.8888,52.7412,30.4638z"/>
        <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M31.5048,26.4158c0,0,4.1241,2.5339,8.6569,0"/>
        <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M38.0135,30.0396"/>
        <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M33.6104,30.0396"/>
        <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M33.5361,31.3179c0,0,2.2019-3.7509,4.5362,0"/>
        <polyline fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" points="52.6639,29.9332 53.097,26.5619 49.2641,26.0342"/>
        <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M33.9549,30.0271c0,0,1.7954-3.7509,3.6988,0"/>
      </g>
    </svg>
  );
}
export const SucceededFace = memo(_SucceededFace);

const faces = Object.freeze({
  normal: NormalFace,
  failed: FailedFace,
  succeeded: SucceededFace,
});

function _ResetButton({face, onClick}) {
  const Face = faces[face];
  return (<button className="reset-button" onClick={onClick}><Face /></button>);
}
export const ResetButton = memo(_ResetButton);