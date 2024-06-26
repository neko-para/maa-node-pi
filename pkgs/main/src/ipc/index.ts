import { setupMaaIpc } from './maa'
import { setupPiIpc } from './pi'

export function setupIpc() {
  setupMaaIpc()
  setupPiIpc()
}
