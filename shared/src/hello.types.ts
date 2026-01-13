/**
 * Response type for Hello endpoint
 */
export interface HelloResponse {
  /** Unique identifier */
  id: number;
  
  /** Hello message content */
  message: string;
  
  /** Timestamp when the message was created */
  timestamp: Date;
}

/**
 * DTO for creating a Hello entity
 */
export interface CreateHelloDto {
  /** Message content */
  message: string;
}
