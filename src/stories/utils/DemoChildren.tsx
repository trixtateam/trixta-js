import React from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { TrixtaActionComponentArgs } from '../../main/React/components/actions/types';
import { TrixtaReactionComponentArgs } from '../../main/React/components/reactions/types';
import { JsonEditor, JsonViewer } from './JsonViewer';

export const DemoChildActionComponent = (
  props: TrixtaActionComponentArgs,
): React.ReactElement => {
  const [submitData, updateSubmitData] = React.useState({});

  return (
    <Container fluid>
      <Row>
        <Col>
          <p className="lead">
            Click the submit button to submit your data below to Trixta for the
            selected action and role
          </p>
          <Button
            onClick={() => props.submit(submitData)}
            disabled={props.isInProgress}
            variant="primary"
          >
            {props.isInProgress ? 'Loading...' : 'Submit'}
          </Button>
        </Col>
      </Row>
      <Row>
        <hr />
      </Row>
      <Row>
        <Col>
          <h4>Data to Submit</h4>
          <JsonEditor
            src={submitData}
            onEdit={({ updated_src }) => updateSubmitData(updated_src)}
            onAdd={({ updated_src }) => updateSubmitData(updated_src)}
          />
        </Col>
        <Col>
          <h4>Response</h4>
          {props.isInProgress && (
            <Spinner animation="border" variant="primary" />
          )}
          {!props.isInProgress && props.response && (
            <JsonViewer data={props.response} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export const DemoChildReactionComponent = (
  props: TrixtaReactionComponentArgs,
): React.ReactElement => {
  const [submitData, updateSubmitData] = React.useState({});

  return (
    <Container fluid>
      <Row>
        <Col>
          <p className="lead">
            Click the submit button to submit your data below to Trixta for the
            selected reaction and role
          </p>
          <Button
            onClick={() => props.submit(submitData)}
            disabled={props.isInProgress}
            variant="primary"
          >
            {props.isInProgress ? 'Loading...' : 'Submit'}
          </Button>
        </Col>
      </Row>
      <Row>
        <hr />
      </Row>
      <Row>
        <Col>
          <h4>Data to Submit</h4>
          <JsonEditor
            src={submitData}
            onEdit={({ updated_src }) => updateSubmitData(updated_src)}
            onAdd={({ updated_src }) => updateSubmitData(updated_src)}
          />
        </Col>
        <Col>
          <h4>Response</h4>
          {props.isInProgress && (
            <Spinner animation="border" variant="primary" />
          )}
          {!props.isInProgress && props.response && (
            <JsonViewer data={props.response} />
          )}
        </Col>
      </Row>
    </Container>
  );
};
