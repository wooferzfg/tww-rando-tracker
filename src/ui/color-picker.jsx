import PropTypes from 'prop-types';
import React from 'react';
import { MaterialPicker } from 'react-color';

import KeyDownWrapper from './key-down-wrapper';

class ColorPicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { displayPicker: false };
  }

  handleClick() {
    const { displayPicker } = this.state;

    this.setState({ displayPicker: !displayPicker });
  }

  handleClose() {
    this.setState({ displayPicker: false });
  }

  handleChangeComplete(color) {
    const { updateColor } = this.props;

    updateColor(color.hex);
  }

  render() {
    const { color } = this.props;
    const { displayPicker } = this.state;

    return (
      <div>
        <div
          aria-label="Pick Color"
          className="color-picker-button"
          onClick={() => this.handleClick()}
          onKeyDown={KeyDownWrapper.onSpaceKey(this.handleClick)}
          role="button"
          style={{ backgroundColor: color }}
          tabIndex="0"
        />
        {displayPicker && (
          <div className="color-picker-wrapper">
            <div
              aria-label="Close Color Picker"
              className="close-color-picker"
              onClick={() => this.handleClose()}
              onKeyDown={KeyDownWrapper.onSpaceKey(this.handleClose)}
              role="button"
              tabIndex="0"
            />
            <MaterialPicker
              color={color}
              onChangeComplete={(newColor) => this.handleChangeComplete(newColor)}
            />
          </div>
        )}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  updateColor: PropTypes.func.isRequired,
};

export default ColorPicker;
