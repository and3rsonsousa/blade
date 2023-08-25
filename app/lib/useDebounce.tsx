import { useRef } from "react";

export default function useDebounce(fn: (...args: any) => void, delay: number) {
	const timeoutRef = useRef<number>();
	function debounceFn(...args: any) {
		window.clearInterval(timeoutRef.current);
		timeoutRef.current = window.setTimeout(() => {
			fn(...args);
		}, delay);
	}
	return debounceFn;
}
