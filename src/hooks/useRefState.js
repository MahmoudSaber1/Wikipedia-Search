import { useEffect, useRef } from "react";

const useRefState = (state) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = state;
	});

	return ref.current;
};

export default useRefState;
