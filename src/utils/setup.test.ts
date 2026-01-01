/**
 * 测试框架配置验证
 * 确保 Vitest 和 fast-check 正确配置
 */
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

describe('测试框架配置验证', () => {
  it('Vitest 基础测试应该通过', () => {
    expect(1 + 1).toBe(2)
  })

  it('fast-check 属性测试应该工作', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        // 加法交换律
        return a + b === b + a
      }),
      { numRuns: 100 }
    )
  })
})
