/*
 * Copyright 2018 Teralytics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import React from 'react';

export const Message = ({ children }) => <div style={{ padding: '1em' }}>{children}</div>;

const withFetch = (mode, propName, url) => (Comp) => (props) => {
  class Fetcher extends React.Component {
    state = {
      error: null,
      data: null,
    };
    componentDidMount() {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
            return response.json();
        })
        .catch(reason => {
          console.error(reason);
          this.setState({ error: true });
        })
        .then(data => this.setState({ data: data }));
    }
    render() {
      const { data, error } = this.state;
      if (error) {
        return <Message>Oops… Data fetching failed.</Message>;
      }
      if (!data) {
        return <Message>Fetching data…</Message>;
      }
      return <Comp {...{ ...props, [propName]: this.state.data }} />;
    }
  }
  return <Fetcher />;
};

export const withFetchCsv = (propName, url) => withFetch('csv', propName, url);
export const withFetchJson = (propName, url) => withFetch('json', propName, url);