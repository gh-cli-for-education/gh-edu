import { config } from '../../config.cjs'

export default function main() {
  console.log(config.defaultOrg ? config.defaultOrg : "The organization is not set")
}
