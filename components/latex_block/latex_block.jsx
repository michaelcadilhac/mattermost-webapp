// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

export default class LatexBlock extends React.Component {
    static propTypes = {
        content: PropTypes.string.isRequired,
        displayMode: PropTypes.bool,
        enableLatex: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        displayMode: true,
    }

    constructor(props) {
        super(props);

        this.state = {
            katex: null,
        };
    }

    componentDidMount() {
        import('katex').then((katex) => {
            this.setState({katex});
        });
    }

    render() {
        if (this.state.katex == null || !this.props.enableLatex) {
            return (
                <div
                    className='post-body--code tex'
                >
                    {this.props.content}
                </div>
            );
        }

        try {
            const katexOptions = {
                throwOnError: false,
                displayMode: this.props.displayMode,
                maxSize: 200,
                maxExpand: 100
            };
            const html = this.state.katex.renderToString(this.props.content, katexOptions);

            return (
                <span
                    className='post-body--code tex'
                    dangerouslySetInnerHTML={{__html: html}}
                />
            );
        } catch (e) {
            return (
                <span
                    className='post-body--code tex'
                >
                    <FormattedMessage
                        id='katex.error'
                        defaultMessage="Couldn't compile your Latex code. Please review the syntax and try again."
                    />
                </span>
            );
        }
    }
}

LatexBlock.defaultProps = {
    enableLatex: false,
};
