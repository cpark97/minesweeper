import { memo } from 'react';

import './SevenSegments.scss';

function _SevenSegment({value}) {
  let className = ['seven-segment'];
  if (value !== null) {
    className.push(`seven-segment--${value}`);
  }
  return (
    <svg className={className.join(' ')} viewBox="0 0 128 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 0 h126 l-40 40 h-46 Z" stroke="none" fill="#660000" className="seven-segment__a"/>
      <path d="M128 1 v126 l-40 -40 v-46 Z" stroke="none" fill="#660000" className="seven-segment__b"/>
      <path d="M128 129 v126 l-40 -40 v-46 Z" stroke="none" fill="#660000" className="seven-segment__c"/>
      <path d="M1 256 h126 l-40 -40 h-46 Z" stroke="none" fill="#660000" className="seven-segment__d"/>
      <path d="M0 255 v-126 l40 40 v46 Z" stroke="none" fill="#660000" className="seven-segment__e"/>
      <path d="M0 1 v126 l40 -40 v-46 Z" stroke="none" fill="#660000" className="seven-segment__f"/>
      <path d="M0 128 l40 -25 h48 l40 25 l-40 25 h-46 Z" stroke="none" fill="#660000" className="seven-segment__g"/>
    </svg>
  );
}

export const SevenSegment = memo(_SevenSegment);

function spliltDigits(num) {
  const digits = [];
  if (num < 0) {
    num = -num;
  }

  do {
    digits.push(num % 10);
    num = Math.floor(num / 10);
  } while (num != 0);

  return digits;
}

function _SevenSegments({numDigits, value}) {
  const max = Math.pow(10, numDigits) - 1;
  const min = 1 - Math.pow(10, numDigits - 1);
  if (value > max) {
    value = max;
  }
  else if (value < min) {
    value = min;
  }

  const digits = spliltDigits(value);
  if (value < 0) {
    while (digits.length < numDigits - 1) {
      digits.push(0);
    }
    digits.push('dash');
  }
  else {
    while (digits.length < numDigits) {
      digits.push(null);
    }
  }

  return (
    <div className="seven-segments">
      {digits.reverse().map((value, i) => <SevenSegment key={i} value={value} />)}
    </div>
  );
}

export const SevenSegments = memo(_SevenSegments);