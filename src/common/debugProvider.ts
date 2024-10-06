import { isTrue } from '@/common/booleanUtils'

/**
 * This function is used to check if the debug mode is enabled.
 */
function isDebugEnabled(): boolean {
  return isTrue(import.meta.env.VITE_IS_DEBUG_ENABLE)
}

export const isDebugEnable = isDebugEnabled()

// Add default export
export default { isDebugEnable }
