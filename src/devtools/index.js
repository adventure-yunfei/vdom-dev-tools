/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDom from 'react-dom'
import TreeView from 'react-treeview'

import 'react-treeview/react-treeview.css'
import './index.css'

function scrollIntoView (node) {
  const container = document.querySelector('.tree-container');
  container.scrollTop = node.offsetTop;
}

export default function initDevTool (bridge) {
  function walk (node, fn) {
    const isDone = fn(node) === false
    if (isDone) {
      return false
    }
    return !node.children.some(c => {
      return walk(c, fn) === false
    })
  }

  function setParent (node, parent) {
    node.parent = parent
    node.children.forEach(c => setParent(c, node))
  }

  function markExpend (node) {
    node.isExpend = true
    while (node.parent) {
      node.parent.isExpend = true
      node = node.parent
    }
  }

  class Tree extends React.Component {
    constructor (...args) {
      super(...args)
      this.state = {
        collapsed: this.props.collapsed
      }

      this.onClick = () => {
        this.setState({
          collapsed: !this.state.collapsed
        })
      }

      this.onHighlight = () => {
        bridge.send('highlight', {
          id: this.props.id
        })
      }

      this.onSelect = () => {
        this.props.onSelectChange(this.props.id)
        bridge.send('select', {
          id: this.props.id
        })
      }
    }

    componentWillReceiveProps (props) {
      if (!props.collapsed) {
        this.setState({
          collapsed: false
        })
      }
      if (props.isSelected) {
        const {refs: {domNode}} = this;
        scrollIntoView(domNode);
      }
    }

    render () {
      return (
        <TreeView
          className={this.props.isSelected ? 'selected' : ''}
          nodeLabel={<span ref='domNode' onMouseEnter={this.onHighlight} onClick={this.onSelect}>{this.props.nodeLabel}</span>}
          onMouseEnter={this.onMouseEnter}
          onClick={this.onClick}
          collapsed={this.state.collapsed}>
            {this.props.children}
        </TreeView>
      )
    }
  }

  function nestedTree (node, extraProps) {
    return (
    <Tree {...extraProps} key={node.id} nodeLabel={node.type} collapsed={!node.isExpend} id={node.id} isSelected={node.isSelected}>
      {node.children.map(n => nestedTree(n, extraProps))}
    </Tree>
    )
  }

  class App extends React.Component {

    constructor (...args) {
      super(...args);
      this.state = {
        selectedId: null,
        root: null,
        isInspecting: false
      }
    }

    componentDidMount () {
      bridge.on('flush', (payload) => {
        this.setState({
          root: payload.root
        })
      })

      bridge.on('select', ({selectedId}) => {
        this.setState({selectedId})
      })

      bridge.on('toggle-inspect', ({isInspecting}) => {
        this.setState({isInspecting})
      })
    }

    toggleInspect () {
      const isInspecting = !this.state.isInspecting;
      this.setState({isInspecting})
      bridge.send('toggle-inspect', {
        isInspecting
      })
    }

    render () {
      const {selectedId, root} = this.state;
      let innerTree;
      let selectedNode = '';
      if (!root) {
        innerTree = <div></div>;
      } else {
        setParent(root)
        walk(root, n => {
          n.isSelected = false
        });
        walk(root, n => {
          if (n.id === selectedId) {
            n.isSelected = true
            selectedNode = n
            markExpend(n)
            return false
          }
        })
        innerTree = nestedTree(root, {onSelectChange: (id) => this.setState({selectedId: id})})
      }
      return (
        <div className='app'>
          <div className='header'>
            <label className='inspecting-button'>
              inspect
              <input type='checkbox' checked={!!this.state.isInspecting} onChange={() => { this.toggleInspect() }} />
            </label>
          </div>
          <div className='props-info'>{selectedNode.type}:{selectedNode.id}</div>
          <div className='tree-container'>{innerTree}</div>
        </div>
      )
    }
  }

  ReactDom.render(<App />, document.querySelector('#dev-tool-container'))
}

