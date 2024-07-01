import { ProjectInterfaceConfigData, ProjectInterfaceData } from './data'
import { ProjectInterfaceRuntimeParam } from './types'

export class ProjectInterfaceCore {
  interface: ProjectInterfaceData
  config: ProjectInterfaceConfigData

  constructor() {
    this.interface = new ProjectInterfaceData()
    this.config = new ProjectInterfaceConfigData()
  }

  build(): ProjectInterfaceRuntimeParam {
    const param: Partial<ProjectInterfaceRuntimeParam> = {}

    return param as ProjectInterfaceRuntimeParam
  }
}
