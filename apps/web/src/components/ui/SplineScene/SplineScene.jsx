import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const SplineScene = ({ scene, className }) => (
  <Suspense fallback={<div className={className} />}>
    <Spline scene={scene} className={className} />
  </Suspense>
);

export default SplineScene;
