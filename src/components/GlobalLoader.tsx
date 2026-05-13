"use client";

import { useAppSelector } from "../store/store";
import Loader from "./Loader";

const GlobalLoader = () => {
    const { isLoading } = useAppSelector(state => state.loader);
    return isLoading ? <Loader /> : null;
}

export default GlobalLoader