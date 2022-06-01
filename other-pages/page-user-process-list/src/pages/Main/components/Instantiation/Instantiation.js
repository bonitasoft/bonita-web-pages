/**
 * Copyright (C) 2018 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Instantiation.css';
import { Link } from 'react-router-dom';
import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Alerts } from '../../../../common';
import * as queryString from 'querystring';

class Instantiation extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmited = this.onFormSubmited.bind(this);
    this.getUrlContext = this.getUrlContext.bind(this);
    window.addEventListener('message', this.onFormSubmited, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onFormSubmited);
  }

  getUrlContext() {
    let locationHref = window.location.href;
    let indexOfPortal = locationHref.indexOf('/portal');
    return locationHref.substring(0, indexOfPortal);
  }

  onFormSubmited(message) {
    const { t } = this.props;
    const messageData = message.data;
    let jsonMessage =
      typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
    if (jsonMessage.action === 'Start process') {
      if (jsonMessage.message === 'success') {
        const params = queryString.parse(
          this.props.location.search.replace('?', '')
        );
        if (params.redirect) {
          let newUrl =
            window.top.location.origin +
            window.top.location.pathname +
            '../' +
            params.redirect;
          window.top.location.href = newUrl;
        } else {
          this.props.history.push('/');
          let caseId = '';
          if (jsonMessage.dataFromSuccess) {
            caseId = jsonMessage.dataFromSuccess.caseId;
          }
          Alerts.success(
            t('The case {{caseId}} has been started successfully.', {
              caseId: caseId
            })
          );
        }
      } else {
        Alerts.error(t('Error while starting the case.'));
      }
    }
  }

  render() {
    const { processName, processVersion } = this.props.match.params;
    const { t } = this.props;
    return (
      <div className="Instantiation transition-item">
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="cancel-instantiation"> {t('Cancel')} </Tooltip>}
          delayShow={2000}
        >
          <Link to="/">
            <div className="cancel-bar">
              <div className="cancel-bar-content">
                <Glyphicon glyph="chevron-left" />
              </div>
            </div>
          </Link>
        </OverlayTrigger>

        <iframe
          src={`${this.getUrlContext()}/portal/resource/process/${processName}/${processVersion}/content/${
            this.props.location.search
          }`}
          title="Instantiation"
        />
      </div>
    );
  }
}
export default withTranslation()(Instantiation);
