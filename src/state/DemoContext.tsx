import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { createSeed } from "../data/seed";
import { applyAction, personaService } from "../data/services";
import type { Action, DemoState } from "../data/types";
export function demoReducer(state: DemoState, action: Action): DemoState {
  try {
    return applyAction(state, action);
  } catch (error) {
    return {
      ...state,
      serial: state.serial + 1,
      notice: {
        text:
          error instanceof Error
            ? error.message
            : "The demo action could not be completed.",
        error: true,
        serial: state.serial + 1,
      },
    };
  }
}
const DemoContext = createContext<{
  state: DemoState;
  dispatch: Dispatch<Action>;
} | null>(null);
export function DemoProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: DemoState;
}) {
  const [state, dispatch] = useReducer(
    demoReducer,
    initialState,
    (s) => s || createSeed(),
  );
  return (
    <DemoContext.Provider value={{ state, dispatch }}>
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("DemoProvider is required");
  return { ...value, persona: personaService.current(value.state) };
}
