import Ajv from 'ajv'
import { existsSync } from 'fs'
import * as fs from 'fs/promises'
import * as path from 'path'

import InterfaceSchemaJson from './schema/interface.schema.json'
import InterfaceConfigSchemaJson from './schema/interface_config.schema.json'
import PipelineSchemaJson from './schema/pipeline.schema.json'
import type { ProjectInterface, ProjectInterfaceConfig } from './types'

const ajv = new Ajv({
  schemas: {
    'https://json-schema.org/draft-07/schema': {},
    'interface.schema.json': InterfaceSchemaJson,
    'interface_config.schema.json': InterfaceConfigSchemaJson,
    'pipeline.schema.json': PipelineSchemaJson
  }
})

const ProjectInterfaceSchema = ajv.getSchema('interface.schema.json')!
const ProjectInterfaceConfigSchema = ajv.getSchema('interface_config.schema.json')!

export const ProjectInterfaceFileName = 'interface.json'
export const ProjectInterfaceConfigFileName = 'config/maa_pi_config.json'

export class ProjectInterfaceData {
  data: ProjectInterface = {
    controller: [],
    resource: [],
    task: []
  }

  reset() {
    this.data = {
      controller: [],
      resource: [],
      task: []
    }
  }

  async load(dir: string) {
    const file = path.join(dir, ProjectInterfaceFileName)
    if (!existsSync(file)) {
      this.reset()
      return
    }
    try {
      this.data = JSON.parse(await fs.readFile(file, 'utf8'))
      this.validateOrReset()
    } catch (_) {
      this.reset()
    }
  }

  async save(dir: string) {
    const file = path.join(dir, ProjectInterfaceFileName)
    await fs.writeFile(file, JSON.stringify(this.data, null, 4))
  }

  validate() {
    if (ProjectInterfaceSchema(this.data)) {
      return null
    } else {
      return ProjectInterfaceSchema.errors ?? []
    }
  }

  validateOrReset() {
    if (this.validate() !== null) {
      this.reset()
    }
  }
}

export class ProjectInterfaceConfigData {
  data: ProjectInterfaceConfig | null = null

  reset() {
    this.data = null
  }

  async load(dir: string) {
    const file = path.join(dir, ProjectInterfaceConfigFileName)
    if (!existsSync(file)) {
      this.reset()
      return
    }
    try {
      this.data = JSON.parse(await fs.readFile(file, 'utf8'))
      this.validateOrReset()
    } catch (_) {
      this.reset()
    }
  }

  async save(dir: string) {
    const file = path.join(dir, ProjectInterfaceConfigFileName)
    await fs.writeFile(
      file,
      JSON.stringify(
        this.data,
        (key, value) => {
          if (key === 'hwnd') {
            return undefined
          } else {
            return value
          }
        },
        4
      )
    )
  }

  validate() {
    if (ProjectInterfaceConfigSchema(this.data)) {
      return null
    } else {
      return ProjectInterfaceConfigSchema.errors ?? []
    }
  }

  validateOrReset() {
    if (this.validate() !== null) {
      this.reset()
    }
  }
}
