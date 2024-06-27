import { setupGlobalIpc } from './global'
import { setupMaaIpc } from './maa'
import { setupPiIpc } from './pi'

export function setupIpc() {
  setupGlobalIpc()
  setupMaaIpc()
  setupPiIpc()
}
