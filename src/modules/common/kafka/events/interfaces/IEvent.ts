export interface IEvent {
  id: string;
  timestamp: String;
  source: string;
  topic: string;
  payload: Record<string, unknown>;
  snapshot: Record<string, unknown>;
}

