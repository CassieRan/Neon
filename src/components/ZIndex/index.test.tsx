import React from 'react'
import { render } from '@testing-library/react'
import ZIndex from './index'

test('generate level', () => {
    const level = ZIndex.level
    expect(ZIndex.gen()).toEqual(level)
})
test('level++', () => {
    const level = ZIndex.level
    ZIndex.gen()
    expect(ZIndex.level).toEqual(level + 1)
})
