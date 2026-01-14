import React from 'react';

import Box              from '@mui/material/Box';
import Checkbox         from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl      from '@mui/material/FormControl';
import IconButton       from '@mui/material/IconButton';
import InputLabel       from '@mui/material/InputLabel';
import List             from '@mui/material/List';
import ListItem         from '@mui/material/ListItem';
import ListItemText     from '@mui/material/ListItemText';
import Menu             from '@mui/material/Menu';
import MenuItem         from '@mui/material/MenuItem';
import Select           from '@mui/material/Select';

import FilterListIcon from '@mui/icons-material/FilterList';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type Option = {
    id: number;
    name: string;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const SelectCountry: React.FC = () => {
    const [options, setOptions] = React.useState<Option[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [selectedOption, setSelectedOption] = React.useState<number | ''>('');

    // States for the config menu and checkboxes
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedConfigs, setSelectedConfigs] = React.useState<string[]>([]); // To store selected checkboxes

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Construct the API URL based on selected configurations
    const buildApiUrl = () => {
        let baseUrl = 'https://api.example.com/options?';
        selectedConfigs.forEach(
            (config, index) => {
                baseUrl += `${config}=true${index < selectedConfigs.length - 1 ? '&' : ''}`;
            }
        );
        return baseUrl;
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Fetch data from the constructed API URL
    const fetchData = (url: string) => {
        setLoading(true);
        fetch(url)
        .then((response) => response.json())
        .then((data) => {
            setOptions(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Fetch data when the component mounts or when selectedConfigs change
    React.useEffect(
        () => {
            const apiUrl = buildApiUrl();
            fetchData(apiUrl);
        },
        [selectedConfigs]
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const handleChange =
        (event: React.ChangeEvent<{ value: unknown }>) => {
            setSelectedOption(event.target.value as number);
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Handle opening and closing of config menu
    const handleClick =
        (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const handleClose =
        () => {
            setAnchorEl(null);
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Handle checkbox toggle
    const handleCheckboxChange =
        (config: string) => {
            setSelectedConfigs(
                (prev) =>
                prev.includes(config) ? prev.filter((item) => item !== config) : [...prev, config]
            );
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    return (
        <div>
            {/* Filter Icon Button */}
            <IconButton onClick={handleClick} color="primary">
                <FilterListIcon />
            </IconButton>

            {/* Config Menu with Checkboxes */}
            <Menu anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
            >
                <List>
                    <ListItem>
                        <Checkbox checked={selectedConfigs.includes('option1')}
                                  onChange={() => handleCheckboxChange('option1')}
                        />
                        <ListItemText primary="Option 1" />
                    </ListItem>
                    <ListItem>
                        <Checkbox checked={selectedConfigs.includes('option2')}
                                  onChange={() => handleCheckboxChange('option2')}
                        />
                        <ListItemText primary="Option 2" />
                    </ListItem>
                    <ListItem>
                        <Checkbox checked={selectedConfigs.includes('option3')}
                                  onChange={() => handleCheckboxChange('option3')}
                        />
                        <ListItemText primary="Option 3" />
                    </ListItem>
                </List>
            </Menu>

            {/* ComboBox */}
            <FormControl fullWidth>
                <InputLabel>Choose an Option</InputLabel>

                {
                    loading
                        ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                                <CircularProgress />
                            </Box>
                          )
                        : (
                            <Select
                            value={selectedOption}
                            onChange={handleChange}
                            label="Choose an Option"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                    {
                                        options.map(
                                            (option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            )
                                        )
                                    }
                            </Select>
                        )
                }
            </FormControl>
        </div>
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default SelectCountry;
