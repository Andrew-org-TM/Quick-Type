export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      scores: {
        Row: {
          accuracy: number
          created_at: string
          endingCorrect: number | null
          endingExtra: number | null
          endingIncorrect: number | null
          endingSkipped: number | null
          id: number
          incorrectKeys: number
          language: string
          raw: number
          testType: string
          timeElapsed: number
          totalKeysPressed: number
          userId: string | null
          wpm: number
        }
        Insert: {
          accuracy?: number
          created_at?: string
          endingCorrect?: number | null
          endingExtra?: number | null
          endingIncorrect?: number | null
          endingSkipped?: number | null
          id?: number
          incorrectKeys?: number
          language?: string
          raw?: number
          testType?: string
          timeElapsed?: number
          totalKeysPressed?: number
          userId?: string | null
          wpm?: number
        }
        Update: {
          accuracy?: number
          created_at?: string
          endingCorrect?: number | null
          endingExtra?: number | null
          endingIncorrect?: number | null
          endingSkipped?: number | null
          id?: number
          incorrectKeys?: number
          language?: string
          raw?: number
          testType?: string
          timeElapsed?: number
          totalKeysPressed?: number
          userId?: string | null
          wpm?: number
        }
      }
      users: {
        Row: {
          auth_uuid: string
          created_at: string | null
          email: string
          id: number
          username: string
        }
        Insert: {
          auth_uuid: string
          created_at?: string | null
          email: string
          id?: number
          username: string
        }
        Update: {
          auth_uuid?: string
          created_at?: string | null
          email?: string
          id?: number
          username?: string
        }
      }
    }
    Views: {
      get_usernames: {
        Row: {
          username: string | null
        }
        Insert: {
          username?: string | null
        }
        Update: {
          username?: string | null
        }
      }
      scores_with_usernames: {
        Row: {
          accuracy: number | null
          created_at: string | null
          endingCorrect: number | null
          endingExtra: number | null
          endingIncorrect: number | null
          endingSkipped: number | null
          id: number | null
          incorrectKeys: number | null
          language: string | null
          raw: number | null
          testType: string | null
          timeElapsed: number | null
          totalKeysPressed: number | null
          userId: string | null
          username: string | null
          wpm: number | null
        }
      }
    }
    Functions: {
      get_usernames: {
        Args: Record<PropertyKey, never>
        Returns: {
          username: string
        }[]
      }
      max_wpm: {
        Args: Record<PropertyKey, never>
        Returns: {
          username: string
          max_wpm: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
