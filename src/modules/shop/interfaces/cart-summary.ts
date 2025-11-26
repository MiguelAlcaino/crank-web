export interface CartSummary {
  id: string
  items: Array<{ id: string; quantity: number; variant: { id: string } }>
}
