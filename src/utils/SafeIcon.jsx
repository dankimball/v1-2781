import React from 'react'
import * as FiIcons from 'react-icons/fi'

const SafeIcon = ({ icon, name, className = '', ...props }) => {
  let IconComponent = icon

  if (!IconComponent && name) {
    IconComponent = FiIcons[`Fi${name}`]
  }

  if (!IconComponent) {
    IconComponent = FiIcons.FiAlertTriangle
  }

  return <IconComponent className={className} {...props} />
}

export default SafeIcon