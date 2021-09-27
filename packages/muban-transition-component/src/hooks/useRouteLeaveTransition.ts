export {};

// PSEUDO CODE:
// /**
//  * Register transitionController with page router context so that it can be invoked on page leave
//  *
//  * @param transitionController
//  */
// export function useRouteLeaveTransition(transitionController: TransitionController): void {
//   const routeTransitionControllers = useRouteTransitionControllers();
//
//   routeTransitionControllers.register(transitionController);
//
//   useUnmounted(() => {
//     routeTransitionControllers.unregister(transitionController);
//   });
// }
