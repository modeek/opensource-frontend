/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';

// @ts-ignore
export const useInterval = (callback: any, delay: number) => {
	// @ts-ignore
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			// @ts-ignore
			savedCallback.current();
		}
		if (delay !== null) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
};
