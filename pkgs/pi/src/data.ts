import Ajv from 'ajv'
import { existsSync } from 'fs'
import * as fs from 'fs/promises'
import * as path from 'path'

import InterfaceSchemaJson from './schema/interface.schema.json'
import PipelineSchemaJson from './schema/pipeline.schema.json'
import type { ProjectInterface, ProjectInterfaceConfig } from './types'

const ajv = new Ajv({
  schemas: {
    'https://json-schema.org/draft-07/schema': {},
    'interface.schema.json': InterfaceSchemaJson,
    'pipeline.schema.json': PipelineSchemaJson
  }
})
const ProjectInterfaceSchema = ajv.getSchema('interface.schema.json')!

export const ProjectInterfaceFileName = 'interface.json'
export const ProjectInterfaceConfigFileName = 'config/maa_pi_config.json'

export class ProjectInterfaceData {
  data: ProjectInterface = {}

  async load(dir: string) {
    const file = path.join(dir, ProjectInterfaceFileName)
    if (!existsSync(file)) {
      this.data = {}
      return
    }
    try {
      this.data = JSON.parse(await fs.readFile(file, 'utf8'))
    } catch (_) {
      this.data = {}
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
}

export class ProjectInterfaceConfigData {
  data: ProjectInterfaceConfig = {}

  async load(dir: string) {
    const file = path.join(dir, ProjectInterfaceConfigFileName)
    if (!existsSync(file)) {
      this.data = {}
      return
    }
    try {
      this.data = JSON.parse(await fs.readFile(file, 'utf8'))
    } catch (_) {
      this.data = {}
    }
  }

  async save(dir: string) {
    const file = path.join(dir, ProjectInterfaceConfigFileName)
    await fs.writeFile(file, JSON.stringify(this.data, null, 4))
  }
}
