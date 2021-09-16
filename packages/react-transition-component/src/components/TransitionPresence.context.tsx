import type { TransitionController } from '@mediamonks/core-transition-component';
import { createContext, useContext } from 'react';

export type LeaveTransitionControllersContextType = Set<TransitionController> | undefined;

export const LeaveTransitionControllersContext =
  createContext<LeaveTransitionControllersContextType>(undefined);

export function useLeaveTransitionControllers(): LeaveTransitionControllersContextType {
  return useContext(LeaveTransitionControllersContext);
}
