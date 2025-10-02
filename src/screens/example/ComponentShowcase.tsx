/**
 * Component Showcase Screen
 * Demonstrates the usage of all reusable components with the color system
 */

import React, { useState } from 'react';
import { Alert } from 'react-native';
import {
  Screen,
  Container,
  Row,
  Column,
  Spacer,
  Divider,
  Card,
  Button,
  Input,
  Typography,
  Heading1,
  Heading2,
  Heading3,
  BodyText,
  Caption,
} from '@components';
import { useTheme } from '@contexts/ThemeContext';

export const ComponentShowcase: React.FC = () => {
  const { theme, toggleTheme, themeMode } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleButtonPress = (buttonType: string) => {
    Alert.alert('Button Pressed', `You pressed the ${buttonType} button!`);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (inputError) setInputError('');
  };

  const validateInput = () => {
    if (inputValue.length < 3) {
      setInputError('Input must be at least 3 characters long');
    } else {
      setInputError('');
      Alert.alert('Success', 'Input is valid!');
    }
  };

  return (
    <Screen scrollable padded>
      <Container>
        {/* Header */}
        <Row justify="space-between" style={{ marginBottom: 24 }}>
          <Column>
            <Heading1 color="contrast">Component Showcase</Heading1>
            <Caption color="muted">Current theme: {themeMode}</Caption>
          </Column>
          <Button
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'}`}
            onPress={toggleTheme}
            variant="outline"
            size="sm"
          />
        </Row>

        <Divider />

        {/* Typography Section */}
        <Card style={{ marginBottom: 24 }}>
          <Heading2 style={{ marginBottom: 16 }}>Typography</Heading2>

          <Heading1 style={{ marginBottom: 8 }}>Heading 1</Heading1>
          <Heading2 style={{ marginBottom: 8 }}>Heading 2</Heading2>
          <Heading3 style={{ marginBottom: 8 }}>Heading 3</Heading3>

          <Spacer size="md" />

          <BodyText style={{ marginBottom: 8 }}>
            This is body text with normal weight and spacing.
          </BodyText>
          <BodyText color="secondary" style={{ marginBottom: 8 }}>
            This is secondary body text with muted color.
          </BodyText>
          <Caption color="muted">
            This is caption text for additional information.
          </Caption>
        </Card>

        {/* Button Section */}
        <Card style={{ marginBottom: 24 }}>
          <Heading2 style={{ marginBottom: 16 }}>Buttons</Heading2>

          <Column gap="md">
            <Row gap="md">
              <Button
                title="Primary"
                onPress={() => handleButtonPress('primary')}
                variant="primary"
              />
              <Button
                title="Secondary"
                onPress={() => handleButtonPress('secondary')}
                variant="secondary"
              />
            </Row>

            <Row gap="md">
              <Button
                title="Outline"
                onPress={() => handleButtonPress('outline')}
                variant="outline"
              />
              <Button
                title="Ghost"
                onPress={() => handleButtonPress('ghost')}
                variant="ghost"
              />
            </Row>

            <Button
              title="Danger Button"
              onPress={() => handleButtonPress('danger')}
              variant="danger"
              fullWidth
            />

            <Row gap="md">
              <Button
                title="Small"
                onPress={() => handleButtonPress('small')}
                size="sm"
              />
              <Button
                title="Medium"
                onPress={() => handleButtonPress('medium')}
                size="md"
              />
              <Button
                title="Large"
                onPress={() => handleButtonPress('large')}
                size="lg"
              />
            </Row>

            <Button title="Loading..." onPress={() => {}} loading disabled />
          </Column>
        </Card>

        {/* Input Section */}
        <Card style={{ marginBottom: 24 }}>
          <Heading2 style={{ marginBottom: 16 }}>Form Inputs</Heading2>

          <Column gap="md">
            <Input
              label="Default Input"
              placeholder="Enter some text..."
              value={inputValue}
              onChangeText={handleInputChange}
              helperText="This is helper text"
            />

            <Input
              label="Input with Validation"
              placeholder="Type at least 3 characters"
              value={inputValue}
              onChangeText={handleInputChange}
              errorText={inputError}
              state={inputError ? 'error' : 'default'}
            />

            <Button
              title="Validate Input"
              onPress={validateInput}
              variant="primary"
            />

            <Input
              label="Filled Input"
              placeholder="Filled variant"
              variant="filled"
            />

            <Input
              label="Disabled Input"
              placeholder="This is disabled"
              state="disabled"
              value="Disabled value"
            />
          </Column>
        </Card>

        {/* Card Variants Section */}
        <Card style={{ marginBottom: 24 }}>
          <Heading2 style={{ marginBottom: 16 }}>Card Variants</Heading2>

          <Column gap="md">
            <Card variant="default">
              <BodyText>Default Card</BodyText>
              <Caption color="muted">With default shadow and styling</Caption>
            </Card>

            <Card variant="elevated">
              <BodyText>Elevated Card</BodyText>
              <Caption color="muted">With enhanced shadow</Caption>
            </Card>

            <Card variant="outlined">
              <BodyText>Outlined Card</BodyText>
              <Caption color="muted">With border instead of shadow</Caption>
            </Card>

            <Card variant="filled">
              <BodyText>Filled Card</BodyText>
              <Caption color="muted">With filled background</Caption>
            </Card>
          </Column>
        </Card>

        {/* Color Showcase */}
        <Card style={{ marginBottom: 24 }}>
          <Heading2 style={{ marginBottom: 16 }}>Semantic Colors</Heading2>

          <Column gap="sm">
            <BodyText color="success">✓ Success message</BodyText>
            <BodyText color="warning">⚠ Warning message</BodyText>
            <BodyText color="error">✗ Error message</BodyText>
            <BodyText color="primary">ℹ Primary information</BodyText>
            <BodyText color="secondary">Secondary information</BodyText>
            <BodyText color="muted">Muted information</BodyText>
          </Column>
        </Card>

        {/* Layout Examples */}
        <Card>
          <Heading2 style={{ marginBottom: 16 }}>Layout Examples</Heading2>

          <Column gap="md">
            <BodyText>Row with space-between:</BodyText>
            <Row
              justify="space-between"
              style={{
                padding: 12,
                backgroundColor: theme.colors.surfaceHighlight,
                borderRadius: 8,
              }}
            >
              <BodyText>Left</BodyText>
              <BodyText>Center</BodyText>
              <BodyText>Right</BodyText>
            </Row>

            <BodyText>Column with center alignment:</BodyText>
            <Column
              align="center"
              gap="xs"
              style={{
                padding: 12,
                backgroundColor: theme.colors.surfaceHighlight,
                borderRadius: 8,
              }}
            >
              <BodyText>Item 1</BodyText>
              <BodyText>Item 2</BodyText>
              <BodyText>Item 3</BodyText>
            </Column>
          </Column>
        </Card>

        <Spacer size="xl" />
      </Container>
    </Screen>
  );
};

export default ComponentShowcase;
